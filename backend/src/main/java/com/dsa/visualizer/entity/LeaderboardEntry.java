package com.dsa.visualizer.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "leaderboard")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false)
    private Integer score = 0; // Total points earned by the user

    @Column(name = "rank_position")
    private Integer rankPosition;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
