package com.dsa.visualizer.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlgorithmDto {
    private Long id;
    private String name;
    private String category;
    private String timeComplexityBest;
    private String timeComplexityWorst;
    private String timeComplexityAvg;
    private String spaceComplexity;
    private String pseudoCode;
    private String explanation;
}
