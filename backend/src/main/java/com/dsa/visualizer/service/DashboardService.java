package com.dsa.visualizer.service;

import com.dsa.visualizer.dto.*;
import com.dsa.visualizer.entity.*;
import com.dsa.visualizer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private AttemptRepository attemptRepository;

    public DashboardStatsDto getDashboardStats(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        // 1. Streak count
        int streak = user.getStreakCount() != null ? user.getStreakCount() : 0;

        // 2. Problems solved
        List<Progress> progressList = progressRepository.findByUserId(user.getId());
        long solvedCount = progressList.stream().filter(Progress::getCompleted).count();

        // 3. Quiz statistics
        List<Quiz> quizzes = quizRepository.findByUserId(user.getId());
        double avgAccuracy = quizzes.isEmpty() ? 0.0 :
                quizzes.stream().mapToDouble(Quiz::getAccuracy).average().orElse(0.0);

        // 4. Leaderboard rank & score
        LeaderboardEntry leaderboardEntry = leaderboardRepository.findByUserId(user.getId())
                .orElseGet(() -> LeaderboardEntry.builder().user(user).score(0).rankPosition(0).build());
        int points = leaderboardEntry.getScore() != null ? leaderboardEntry.getScore() : 0;
        int rank = leaderboardEntry.getRankPosition() != null ? leaderboardEntry.getRankPosition() : 0;

        // 5. Topic progress
        List<ProgressDto> topicProgress = progressList.stream()
                .map(p -> ProgressDto.builder()
                        .id(p.getId())
                        .algorithmName(p.getAlgorithm().getName())
                        .category(p.getAlgorithm().getCategory())
                        .completed(p.getCompleted())
                        .completedAt(p.getCompletedAt())
                        .lastVisualizedAt(p.getLastVisualizedAt())
                        .build())
                .collect(Collectors.toList());

        // 6. Recent activity
        List<ActivityLogDto> recentActivity = activityRepository.findTop15ByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(a -> ActivityLogDto.builder()
                        .activityType(a.getActivityType())
                        .description(a.getDescription())
                        .createdAt(a.getCreatedAt())
                        .build())
                .collect(Collectors.toList());

        // 7. Top rankers preview (limit 5)
        List<LeaderboardEntryDto> topRankers = leaderboardRepository.findAllByOrderByScoreDesc().stream()
                .limit(5)
                .map(e -> LeaderboardEntryDto.builder()
                        .username(e.getUser().getUsername())
                        .score(e.getScore())
                        .rankPosition(e.getRankPosition() != null ? e.getRankPosition() : 0)
                        .updatedAt(e.getUpdatedAt())
                        .build())
                .collect(Collectors.toList());

        // 8. Achievements / Badges
        List<DashboardStatsDto.BadgeDto> badges = achievementRepository.findByUserId(user.getId()).stream()
                .map(ac -> DashboardStatsDto.BadgeDto.builder()
                        .name(ac.getBadge().getName())
                        .description(ac.getBadge().getDescription())
                        .iconUrl(ac.getBadge().getIconUrl())
                        .build())
                .collect(Collectors.toList());

        // 9. Practice graph data (last 30 days attempts grouped by day)
        List<Attempt> attempts = attemptRepository.findByUserId(user.getId());
        Map<String, Integer> attemptsByDate = new TreeMap<>();
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);

        // Pre-populate last 7 days at least to show data
        for (int i = 6; i >= 0; i--) {
            attemptsByDate.put(LocalDateTime.now().minusDays(i).format(formatter), 0);
        }

        for (Attempt attempt : attempts) {
            if (attempt.getAttemptedAt().isAfter(thirtyDaysAgo)) {
                String dateStr = attempt.getAttemptedAt().format(formatter);
                attemptsByDate.put(dateStr, attemptsByDate.getOrDefault(dateStr, 0) + 1);
            }
        }

        List<DashboardStatsDto.DailyActivityPoint> practiceGraphData = attemptsByDate.entrySet().stream()
                .map(entry -> DashboardStatsDto.DailyActivityPoint.builder()
                        .date(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .collect(Collectors.toList());

        return DashboardStatsDto.builder()
                .streakCount(streak)
                .problemsSolved((int) solvedCount)
                .averageAccuracy(avgAccuracy)
                .totalPoints(points)
                .rankPosition(rank)
                .topicProgress(topicProgress)
                .recentActivity(recentActivity)
                .topRankers(topRankers)
                .badges(badges)
                .practiceGraphData(practiceGraphData)
                .build();
    }
}
