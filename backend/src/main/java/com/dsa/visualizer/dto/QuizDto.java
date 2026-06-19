package com.dsa.visualizer.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {
    private Long id;
    private String algorithmName;
    private Integer score;
    private Integer totalQuestions;
    private Double accuracy;
    private Integer timeSpent;
    private LocalDateTime completedAt;
    private List<QuizQuestionDto> questions;
}
