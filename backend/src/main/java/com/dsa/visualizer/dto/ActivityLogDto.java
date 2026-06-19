package com.dsa.visualizer.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityLogDto {
    private String activityType;
    private String description;
    private LocalDateTime createdAt;
}
