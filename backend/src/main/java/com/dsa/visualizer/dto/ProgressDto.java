package com.dsa.visualizer.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressDto {
    private Long id;
    private String algorithmName;
    private String category;
    private Boolean completed;
    private LocalDateTime completedAt;
    private LocalDateTime lastVisualizedAt;
}
