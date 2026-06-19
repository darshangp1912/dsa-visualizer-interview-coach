package com.dsa.visualizer.config;

import com.dsa.visualizer.entity.Algorithm;
import com.dsa.visualizer.entity.Badge;
import com.dsa.visualizer.entity.Role;
import com.dsa.visualizer.repository.AlgorithmRepository;
import com.dsa.visualizer.repository.BadgeRepository;
import com.dsa.visualizer.repository.RoleRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.InputStream;
import java.util.*;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private AlgorithmRepository algorithmRepository;

    // Cache of all loaded questions
    private static final List<Map<String, Object>> questionBank = new ArrayList<>();

    public static List<Map<String, Object>> getQuestionBank() {
        return questionBank;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Roles
        seedRoles();

        // 2. Seed Badges
        seedBadges();

        // 3. Load Questions JSON and Seed Algorithms
        loadQuestionsAndSeedAlgorithms();
    }

    private void seedRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, "ROLE_USER"));
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
        }
    }

    private void seedBadges() {
        if (badgeRepository.count() == 0) {
            List<Badge> badges = Arrays.asList(
                new Badge(null, "First Quiz", "Completed your very first algorithm quiz!", "first_quiz.png"),
                new Badge(null, "10 Problems", "Successfully visualized 10 different algorithms.", "10_problems.png"),
                new Badge(null, "100 Problems", "Successfully visualized 100 algorithms (or repeated practice).", "100_problems.png"),
                new Badge(null, "Perfect Score", "Scored 100% on any algorithm interview quiz.", "perfect_score.png"),
                new Badge(null, "7 Day Streak", "Maintained a 7-day daily practice streak.", "7_day_streak.png"),
                new Badge(null, "30 Day Streak", "Maintained a 30-day daily practice streak.", "30_day_streak.png"),
                new Badge(null, "Sorting Expert", "Completed quizzes for all sorting algorithms.", "sorting_expert.png"),
                new Badge(null, "Tree Expert", "Completed quizzes for all tree algorithms.", "tree_expert.png"),
                new Badge(null, "Master of Graph", "Completed quizzes for all graph algorithms.", "graph_master.png")
            );
            badgeRepository.saveAll(badges);
        }
    }

    private void loadQuestionsAndSeedAlgorithms() {
        try {
            ObjectMapper mapper = new ObjectMapper();
            InputStream inputStream = new ClassPathResource("questions.json").getInputStream();
            List<Map<String, Object>> questions = mapper.readValue(inputStream, new TypeReference<List<Map<String, Object>>>() {});
            
            questionBank.clear();
            questionBank.addAll(questions);

            // Extract unique topics and seed Algorithms if empty
            if (algorithmRepository.count() == 0) {
                Map<String, String> categoryMap = new HashMap<>();
                
                // Group topics by category
                for (Map<String, Object> q : questions) {
                    String topic = (String) q.get("topic");
                    String category = (String) q.get("category");
                    categoryMap.put(topic, category);
                }

                for (Map.Entry<String, String> entry : categoryMap.entrySet()) {
                    String name = entry.getKey();
                    String category = entry.getValue();
                    
                    Algorithm algo = Algorithm.builder()
                            .name(name)
                            .category(category)
                            .timeComplexityBest(getComplexity(name, "best"))
                            .timeComplexityAvg(getComplexity(name, "avg"))
                            .timeComplexityWorst(getComplexity(name, "worst"))
                            .spaceComplexity(getComplexity(name, "space"))
                            .pseudoCode(getPseudoCode(name))
                            .explanation("Interactive step-by-step visualizer for " + name + ".")
                            .build();

                    algorithmRepository.save(algo);
                }
            }
        } catch (Exception e) {
            System.err.println("Failed to load questions database: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private String getComplexity(String name, String type) {
        if (type.equals("best")) {
            if (name.contains("Bubble") || name.contains("Insertion") || name.contains("Linear Search")) return "O(N)";
            if (name.contains("Merge") || name.contains("Heap") || name.contains("Quick")) return "O(N log N)";
            if (name.contains("Binary Search")) return "O(1)";
            return "O(N)";
        } else if (type.equals("avg")) {
            if (name.contains("Bubble") || name.contains("Selection") || name.contains("Insertion")) return "O(N^2)";
            if (name.contains("Merge") || name.contains("Heap") || name.contains("Quick")) return "O(N log N)";
            if (name.contains("Binary Search")) return "O(log N)";
            return "O(N)";
        } else if (type.equals("worst")) {
            if (name.contains("Bubble") || name.contains("Selection") || name.contains("Insertion") || name.contains("Quick")) return "O(N^2)";
            if (name.contains("Merge") || name.contains("Heap")) return "O(N log N)";
            if (name.contains("Binary Search")) return "O(log N)";
            return "O(N)";
        } else { // Space
            if (name.contains("Merge")) return "O(N)";
            if (name.contains("Quick")) return "O(log N)";
            if (name.contains("Heap") || name.contains("Bubble") || name.contains("Selection") || name.contains("Insertion") || name.contains("Search")) return "O(1)";
            return "O(N)";
        }
    }

    private String getPseudoCode(String name) {
        return "procedure " + name.toLowerCase().replace(" ", "") + "(input):\n" +
               "    // Initial check\n" +
               "    if input is empty return\n" +
               "    \n" +
               "    // Algorithm core logic\n" +
               "    for each element in input:\n" +
               "        process(element)\n" +
               "    \n" +
               "    return result";
    }
}
