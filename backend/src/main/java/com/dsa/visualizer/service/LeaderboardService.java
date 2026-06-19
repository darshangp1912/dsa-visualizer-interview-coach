package com.dsa.visualizer.service;

import com.dsa.visualizer.dto.LeaderboardEntryDto;
import com.dsa.visualizer.entity.LeaderboardEntry;
import com.dsa.visualizer.repository.LeaderboardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {
    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Transactional
    public List<LeaderboardEntryDto> getRankings() {
        List<LeaderboardEntry> list = leaderboardRepository.findAllByOrderByScoreDesc();
        
        // Calculate dynamic positions
        for (int i = 0; i < list.size(); i++) {
            LeaderboardEntry entry = list.get(i);
            entry.setRankPosition(i + 1);
            leaderboardRepository.save(entry);
        }

        return list.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private LeaderboardEntryDto mapToDto(LeaderboardEntry entry) {
        return LeaderboardEntryDto.builder()
                .username(entry.getUser().getUsername())
                .score(entry.getScore())
                .rankPosition(entry.getRankPosition() != null ? entry.getRankPosition() : 0)
                .updatedAt(entry.getUpdatedAt())
                .build();
    }
}
