package com.dsa.visualizer.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "algorithms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Algorithm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String category; // Sorting, Searching, Trees, Graphs, DP, Backtracking, Recursion, etc.

    @Column(name = "time_complexity_best")
    private String timeComplexityBest;

    @Column(name = "time_complexity_worst")
    private String timeComplexityWorst;

    @Column(name = "time_complexity_avg")
    private String timeComplexityAvg;

    @Column(name = "space_complexity")
    private String spaceComplexity;

    @Column(name = "pseudo_code", columnDefinition = "TEXT")
    private String pseudoCode;

    @Column(columnDefinition = "TEXT")
    private String explanation;
}
