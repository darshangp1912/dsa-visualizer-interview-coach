package com.dsa.visualizer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attempt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String topic; // Algorithm Name or Category

    @Column(nullable = false)
    private String type; // QUIZ, INTERVIEW, PRACTICE

    @Column(nullable = false)
    private Integer score;

    @Column(name = "total_questions")
    private Integer totalQuestions;

    private Double accuracy;

    @Column(name = "time_spent")
    private Integer timeSpent; // in seconds

    @Column(name = "attempted_at")
    private LocalDateTime attemptedAt = LocalDateTime.now();
}
