package com.dsa.visualizer.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmitRequest {
    private Long algorithmId;
    private Integer timeSpent; // in seconds
    private List<AnswerSubmission> answers;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AnswerSubmission {
        private String questionText;
        private String questionType;
        private List<String> options;
        private String correctAnswer;
        private String userResponse;
        private Boolean isCorrect;
        private String explanation;
    }
}
