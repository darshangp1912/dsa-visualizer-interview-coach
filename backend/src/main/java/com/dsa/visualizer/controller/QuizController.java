package com.dsa.visualizer.controller;

import com.dsa.visualizer.dto.*;
import com.dsa.visualizer.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {
    @Autowired
    private QuizService quizService;

    @GetMapping("/generate/{algorithmId}")
    public ResponseEntity<List<QuizQuestionDto>> generateQuiz(@PathVariable Long algorithmId) {
        try {
            return ResponseEntity.ok(quizService.generateQuiz(algorithmId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizDto> submitQuiz(@RequestBody QuizSubmitRequest request) {
        String username = getLoggedUsername();
        return ResponseEntity.ok(quizService.submitQuiz(username, request));
    }

    private String getLoggedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        throw new IllegalStateException("User not authenticated");
    }
}
