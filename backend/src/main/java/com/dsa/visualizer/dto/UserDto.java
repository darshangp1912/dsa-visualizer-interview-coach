package com.dsa.visualizer.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String email;
    private Integer streakCount;
    private LocalDateTime lastActiveDate;
    private LocalDateTime createdAt;
    private List<String> roles;
}
