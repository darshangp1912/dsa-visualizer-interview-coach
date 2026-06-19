package com.dsa.visualizer.controller;

import com.dsa.visualizer.dto.ProgressDto;
import com.dsa.visualizer.service.ProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    @Autowired
    private ProgressService progressService;

    @PostMapping("/{algorithmId}")
    public ResponseEntity<ProgressDto> updateProgress(@PathVariable Long algorithmId, @RequestParam Boolean completed) {
        String username = getLoggedUsername();
        return ResponseEntity.ok(progressService.updateProgress(username, algorithmId, completed));
    }

    @GetMapping
    public ResponseEntity<List<ProgressDto>> getProgress() {
        String username = getLoggedUsername();
        return ResponseEntity.ok(progressService.getUserProgress(username));
    }

    private String getLoggedUsername() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        }
        throw new IllegalStateException("User not authenticated");
    }
}
