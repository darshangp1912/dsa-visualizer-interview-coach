package com.dsa.visualizer.repository;

import com.dsa.visualizer.entity.Achievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    List<Achievement> findByUserId(Long userId);
    Optional<Achievement> findByUserIdAndBadgeId(Long userId, Long badgeId);
    Boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);
}
