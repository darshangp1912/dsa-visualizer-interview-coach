package com.dsa.visualizer.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private Integer streakCount;
    private Integer problemsSolved;
    private Double averageAccuracy;
    private Integer totalPoints;
    private Integer rankPosition;
    private List<ProgressDto> topicProgress;
    private List<ActivityLogDto> recentActivity;
    private List<LeaderboardEntryDto> topRankers;
    private List<BadgeDto> badges;
    private List<DailyActivityPoint> practiceGraphData;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DailyActivityPoint {
        private String date; // YYYY-MM-DD
        private Integer count;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BadgeDto {
        private String name;
        private String description;
        private String iconUrl;
    }
}
