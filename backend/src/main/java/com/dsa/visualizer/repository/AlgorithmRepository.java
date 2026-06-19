package com.dsa.visualizer.repository;

import com.dsa.visualizer.entity.Algorithm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface AlgorithmRepository extends JpaRepository<Algorithm, Long> {
    Optional<Algorithm> findByName(String name);
    List<Algorithm> findByCategory(String category);
}
