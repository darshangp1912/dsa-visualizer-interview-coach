package com.dsa.visualizer.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizQuestionDto {
    private Long id;
    private String questionText;
    private String questionType;
    private List<String> options;
    private String correctAnswer;
    private String userResponse;
    private Boolean isCorrect;
    private String explanation;
}
