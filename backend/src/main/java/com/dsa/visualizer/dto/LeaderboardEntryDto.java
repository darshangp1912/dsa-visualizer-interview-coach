package com.dsa.visualizer.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LeaderboardEntryDto {
    private String username;
    private Integer score;
    private Integer rankPosition;
    private LocalDateTime updatedAt;
}
