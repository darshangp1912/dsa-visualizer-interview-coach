package com.dsa.visualizer.repository;

import com.dsa.visualizer.entity.LeaderboardEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LeaderboardRepository extends JpaRepository<LeaderboardEntry, Long> {
    List<LeaderboardEntry> findAllByOrderByScoreDesc();
    Optional<LeaderboardEntry> findByUserId(Long userId);
}
