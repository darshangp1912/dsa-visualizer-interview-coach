package com.dsa.visualizer.controller;

import com.dsa.visualizer.dto.AlgorithmDto;
import com.dsa.visualizer.service.AlgorithmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/algorithms")
public class AlgorithmController {
    @Autowired
    private AlgorithmService algorithmService;

    @GetMapping
    public ResponseEntity<List<AlgorithmDto>> getAllAlgorithms() {
        return ResponseEntity.ok(algorithmService.getAllAlgorithms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlgorithmDto> getAlgorithmById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(algorithmService.getAlgorithmById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AlgorithmDto>> getAlgorithmsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(algorithmService.getAlgorithmsByCategory(category));
    }
}
