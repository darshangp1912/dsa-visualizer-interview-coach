package com.dsa.visualizer.service;

import com.dsa.visualizer.dto.ProgressDto;
import com.dsa.visualizer.entity.*;
import com.dsa.visualizer.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProgressService {
    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AlgorithmRepository algorithmRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Transactional
    public ProgressDto updateProgress(String username, Long algorithmId, Boolean completed) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        Algorithm algorithm = algorithmRepository.findById(algorithmId)
                .orElseThrow(() -> new IllegalArgumentException("Algorithm not found: " + algorithmId));

        Optional<Progress> progressOpt = progressRepository.findByUserIdAndAlgorithmId(user.getId(), algorithmId);
        Progress progress;

        if (progressOpt.isPresent()) {
            progress = progressOpt.get();
            progress.setLastVisualizedAt(LocalDateTime.now());
            if (completed && !progress.getCompleted()) {
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
            }
        } else {
            progress = Progress.builder()
                    .user(user)
                    .algorithm(algorithm)
                    .completed(completed)
                    .completedAt(completed ? LocalDateTime.now() : null)
                    .lastVisualizedAt(LocalDateTime.now())
                    .build();
        }

        Progress savedProgress = progressRepository.save(progress);

        // Log visualization activity
        activityRepository.save(ActivityLog.builder()
                .user(user)
                .activityType("VISUALIZATION")
                .description("Visualized algorithm: " + algorithm.getName() + (completed ? " (Completed)" : ""))
                .createdAt(LocalDateTime.now())
                .build());

        // Check and unlock badges based on visualization
        checkBadgeAchievements(user);

        return mapToDto(savedProgress);
    }

    public List<ProgressDto> getUserProgress(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        return progressRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private void checkBadgeAchievements(User user) {
        List<Progress> completedList = progressRepository.findByUserId(user.getId()).stream()
                .filter(Progress::getCompleted)
                .collect(Collectors.toList());
        int completedCount = completedList.size();

        // 1. Check "10 Problems"
        if (completedCount >= 10) {
            unlockBadge(user, "10 Problems");
        }
        // 2. Check "100 Problems"
        if (completedCount >= 100) {
            unlockBadge(user, "100 Problems");
        }

        // 3. Category Specific Badges
        long sortingCount = completedList.stream().filter(p -> p.getAlgorithm().getCategory().equals("Sorting")).count();
        if (sortingCount >= 9) { // 9 sorting algorithms
            unlockBadge(user, "Sorting Expert");
        }

        long treeCount = completedList.stream().filter(p -> p.getAlgorithm().getCategory().equals("Trees")).count();
        if (treeCount >= 4) { // 4 tree algorithms
            unlockBadge(user, "Tree Expert");
        }

        long graphCount = completedList.stream().filter(p -> p.getAlgorithm().getCategory().equals("Graphs")).count();
        if (graphCount >= 8) { // 8 graph algorithms
            unlockBadge(user, "Master of Graph");
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

                // Log badge unlock activity
                activityRepository.save(ActivityLog.builder()
                        .user(user)
                        .activityType("BADGE_UNLOCKED")
                        .description("Unlocked new achievement badge: " + badgeName)
                        .createdAt(LocalDateTime.now())
                        .build());
            }
        }
    }

    private ProgressDto mapToDto(Progress progress) {
        return ProgressDto.builder()
                .id(progress.getId())
                .algorithmName(progress.getAlgorithm().getName())
                .category(progress.getAlgorithm().getCategory())
                .completed(progress.getCompleted())
                .completedAt(progress.getCompletedAt())
                .lastVisualizedAt(progress.getLastVisualizedAt())
                .build();
    }
}
