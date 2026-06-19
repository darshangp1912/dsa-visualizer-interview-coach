package com.dsa.visualizer.service;

import com.dsa.visualizer.config.DatabaseSeeder;
import com.dsa.visualizer.dto.*;
import com.dsa.visualizer.entity.*;
import com.dsa.visualizer.repository.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class QuizService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AlgorithmRepository algorithmRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private AttemptRepository attemptRepository;

    /**
     * Generates a 12-question quiz for the specific algorithm topic:
     * - 5 MCQs
     * - 2 Coding Questions
     * - 2 Dry Run Questions
     * - 2 Complexity Questions
     * - 1 Optimization Question
     */
    public List<QuizQuestionDto> generateQuiz(Long algorithmId) {
        Algorithm algorithm = algorithmRepository.findById(algorithmId)
                .orElseThrow(() -> new IllegalArgumentException("Algorithm not found: " + algorithmId));

        List<Map<String, Object>> allQuestions = DatabaseSeeder.getQuestionBank();
        List<Map<String, Object>> topicQuestions = allQuestions.stream()
                .filter(q -> q.get("topic").equals(algorithm.getName()))
                .collect(Collectors.toList());

        List<QuizQuestionDto> quizQuestions = new ArrayList<>();

        // Group by type
        List<Map<String, Object>> mcqs = filterQuestionsByType(topicQuestions, "MCQ");
        List<Map<String, Object>> codings = filterQuestionsByType(topicQuestions, "CODING");
        List<Map<String, Object>> dryruns = filterQuestionsByType(topicQuestions, "DRY_RUN");
        List<Map<String, Object>> complexities = filterQuestionsByType(topicQuestions, "COMPLEXITY");
        List<Map<String, Object>> optimizations = filterQuestionsByType(topicQuestions, "OPTIMIZATION");

        // Select exact number required (5 MCQ, 2 Coding, 2 Dry Run, 2 Complexity, 1 Optimization)
        addSelectedQuestions(mcqs, 5, quizQuestions);
        addSelectedQuestions(codings, 2, quizQuestions);
        addSelectedQuestions(dryruns, 2, quizQuestions);
        addSelectedQuestions(complexities, 2, quizQuestions);
        addSelectedQuestions(optimizations, 1, quizQuestions);

        return quizQuestions;
    }

    private List<Map<String, Object>> filterQuestionsByType(List<Map<String, Object>> list, String type) {
        return list.stream()
                .filter(q -> q.get("questionType").equals(type))
                .collect(Collectors.toList());
    }

    @SuppressWarnings("unchecked")
    private void addSelectedQuestions(List<Map<String, Object>> src, int count, List<QuizQuestionDto> dest) {
        Collections.shuffle(src);
        int limit = Math.min(count, src.size());
        for (int i = 0; i < limit; i++) {
            Map<String, Object> q = src.get(i);
            dest.add(QuizQuestionDto.builder()
                    .id(Long.valueOf((Integer) q.get("id")))
                    .questionText((String) q.get("questionText"))
                    .questionType((String) q.get("questionType"))
                    .options((List<String>) q.get("options"))
                    .correctAnswer((String) q.get("correctAnswer"))
                    .explanation((String) q.get("explanation"))
                    .build());
        }
    }

    @Transactional
    public QuizDto submitQuiz(String username, QuizSubmitRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        Algorithm algorithm = algorithmRepository.findById(request.getAlgorithmId())
                .orElseThrow(() -> new IllegalArgumentException("Algorithm not found: " + request.getAlgorithmId()));

        List<QuizQuestion> dbQuestions = new ArrayList<>();
        int score = 0;
        int totalQuestions = request.getAnswers().size();

        Quiz quiz = Quiz.builder()
                .user(user)
                .algorithm(algorithm)
                .timeSpent(request.getTimeSpent())
                .completedAt(LocalDateTime.now())
                .build();

        int pointsEarned = 0;

        for (QuizSubmitRequest.AnswerSubmission ans : request.getAnswers()) {
            boolean isCorrect = ans.getIsCorrect() != null && ans.getIsCorrect();
            if (isCorrect) {
                score++;
                if (ans.getQuestionType().equals("CODING") || ans.getQuestionType().equals("OPTIMIZATION")) {
                    pointsEarned += 20;
                } else {
                    pointsEarned += 10;
                }
            }

            ObjectMapper mapper = new ObjectMapper();
            String optionsJson = "";
            try {
                optionsJson = mapper.writeValueAsString(ans.getOptions());
            } catch (Exception ignored) {}

            dbQuestions.add(QuizQuestion.builder()
                    .quiz(quiz)
                    .questionText(ans.getQuestionText())
                    .questionType(ans.getQuestionType())
                    .optionsJson(optionsJson)
                    .correctAnswer(ans.getCorrectAnswer())
                    .userResponse(ans.getUserResponse())
                    .isCorrect(isCorrect)
                    .explanation(ans.getExplanation())
                    .build());
        }

        double accuracy = totalQuestions > 0 ? ((double) score / totalQuestions) * 100.0 : 0.0;

        quiz.setScore(score);
        quiz.setTotalQuestions(totalQuestions);
        quiz.setAccuracy(accuracy);
        quiz.setQuestions(dbQuestions);

        quizRepository.save(quiz);

        // Record Attempt
        attemptRepository.save(Attempt.builder()
                .user(user)
                .topic(algorithm.getName())
                .type("QUIZ")
                .score(score)
                .totalQuestions(totalQuestions)
                .accuracy(accuracy)
                .timeSpent(request.getTimeSpent())
                .attemptedAt(LocalDateTime.now())
                .build());

        // Update Leaderboard score
        LeaderboardEntry leaderboardEntry = leaderboardRepository.findByUserId(user.getId())
                .orElseGet(() -> LeaderboardEntry.builder().user(user).score(0).build());
        leaderboardEntry.setScore(leaderboardEntry.getScore() + pointsEarned);
        leaderboardEntry.setUpdatedAt(LocalDateTime.now());
        leaderboardRepository.save(leaderboardEntry);

        // Log quiz activity
        activityRepository.save(ActivityLog.builder()
                .user(user)
                .activityType("QUIZ")
                .description("Submitted quiz for " + algorithm.getName() + ": Scored " + score + "/" + totalQuestions + " (Points: +" + pointsEarned + ")")
                .createdAt(LocalDateTime.now())
                .build());

        // Badge Unlocks
        checkQuizBadges(user, score, totalQuestions);

        // Map to response DTO
        return mapToDto(quiz);
    }

    private void checkQuizBadges(User user, int score, int totalQuestions) {
        // 1. First Quiz
        unlockBadge(user, "First Quiz");

        // 2. Perfect Score
        if (score == totalQuestions && totalQuestions > 0) {
            unlockBadge(user, "Perfect Score");
        }
    }

    private void unlockBadge(User user, String badgeName) {
        Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isPresent()) {
            Badge badge = badgeOpt.get();
            if (!achievementRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId())) {
                achievementRepository.save(Achievement.builder()
                        .user(user)
                        .badge(badge)
                        .unlockedAt(LocalDateTime.now())
                        .build());

                activityRepository.save(ActivityLog.builder()
                        .user(user)
                        .activityType("BADGE_UNLOCKED")
                        .description("Unlocked new achievement badge: " + badgeName)
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        }
    }

    private QuizDto mapToDto(Quiz quiz) {
        return QuizDto.builder()
                .id(quiz.getId())
                .algorithmName(quiz.getAlgorithm().getName())
                .score(quiz.getScore())
                .totalQuestions(quiz.getTotalQuestions())
                .accuracy(quiz.getAccuracy())
                .timeSpent(quiz.getTimeSpent())
                .completedAt(quiz.getCompletedAt())
                .questions(quiz.getQuestions().stream().map(q -> {
                    ObjectMapper mapper = new ObjectMapper();
                    List<String> options = new ArrayList<>();
                    try {
                        options = mapper.readValue(q.getOptionsJson(), new TypeReference<List<String>>() {});
                    } catch (Exception ignored) {}

                    return QuizQuestionDto.builder()
                            .id(q.getId())
                            .questionText(q.getQuestionText())
                            .questionType(q.getQuestionType())
                            .options(options)
                            .correctAnswer(q.getCorrectAnswer())
                            .userResponse(q.getUserResponse())
                            .isCorrect(q.getIsCorrect())
                            .explanation(q.getExplanation())
                            .build();
                }).collect(Collectors.toList()))
                .build();
    }
}
