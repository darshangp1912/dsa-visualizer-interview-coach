package com.dsa.visualizer.service;

import com.dsa.visualizer.dto.AlgorithmDto;
import com.dsa.visualizer.entity.Algorithm;
import com.dsa.visualizer.repository.AlgorithmRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlgorithmService {
    @Autowired
    private AlgorithmRepository algorithmRepository;

    public List<AlgorithmDto> getAllAlgorithms() {
        return algorithmRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public AlgorithmDto getAlgorithmById(Long id) {
        Algorithm algo = algorithmRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Algorithm not found with ID: " + id));
        return mapToDto(algo);
    }

    public AlgorithmDto getAlgorithmByName(String name) {
        Algorithm algo = algorithmRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Algorithm not found with name: " + name));
        return mapToDto(algo);
    }

    public List<AlgorithmDto> getAlgorithmsByCategory(String category) {
        return algorithmRepository.findByCategory(category).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AlgorithmDto mapToDto(Algorithm algo) {
        return AlgorithmDto.builder()
                .id(algo.getId())
                .name(algo.getName())
                .category(algo.getCategory())
                .timeComplexityBest(algo.getTimeComplexityBest())
                .timeComplexityAvg(algo.getTimeComplexityAvg())
                .timeComplexityWorst(algo.getTimeComplexityWorst())
                .spaceComplexity(algo.getSpaceComplexity())
                .pseudoCode(algo.getPseudoCode())
                .explanation(algo.getExplanation())
                .build();
    }
}
