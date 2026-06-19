package com.dsa.visualizer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "quiz_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column(name = "question_text", columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(name = "question_type", nullable = false)
    private String questionType; // MCQ, CODING, DRY_RUN, COMPLEXITY, OPTIMIZATION

    @Column(name = "options_json", columnDefinition = "TEXT")
    private String optionsJson; // MCQ options serialized as JSON array

    @Column(name = "correct_answer", columnDefinition = "TEXT")
    private String correctAnswer;

    @Column(name = "user_response", columnDefinition = "TEXT")
    private String userResponse;

    @Column(name = "is_correct")
    private Boolean isCorrect = false;

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
