package com.dsa.visualizer.service;

import com.dsa.visualizer.dto.*;
import com.dsa.visualizer.entity.ActivityLog;
import com.dsa.visualizer.entity.LeaderboardEntry;
import com.dsa.visualizer.entity.Role;
import com.dsa.visualizer.entity.User;
import com.dsa.visualizer.repository.ActivityRepository;
import com.dsa.visualizer.repository.LeaderboardRepository;
import com.dsa.visualizer.repository.RoleRepository;
import com.dsa.visualizer.repository.UserRepository;
import com.dsa.visualizer.security.JwtUtils;
import com.dsa.visualizer.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private LeaderboardRepository leaderboardRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Transactional
    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        // Update streak count & last active date
        User user = userRepository.findById(userDetails.getId()).orElseThrow();
        updateUserStreak(user);

        // Log login activity
        activityRepository.save(ActivityLog.builder()
                .user(user)
                .activityType("LOGIN")
                .description("Logged into the application.")
                .createdAt(LocalDateTime.now())
                .build());

        return JwtResponse.builder()
                .token(jwt)
                .id(userDetails.getId())
                .username(userDetails.getUsername())
                .email(userDetails.getEmail())
                .roles(roles)
                .build();
    }

    @Transactional
    public MessageResponse registerUser(SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new IllegalArgumentException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        // Create new user's account
        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(encoder.encode(signUpRequest.getPassword()))
                .streakCount(1)
                .lastActiveDate(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        // Initialize user in Leaderboard
        leaderboardRepository.save(LeaderboardEntry.builder()
                .user(savedUser)
                .score(0)
                .rankPosition(0)
                .updatedAt(LocalDateTime.now())
                .build());

        // Log signup activity
        activityRepository.save(ActivityLog.builder()
                .user(savedUser)
                .activityType("SIGNUP")
                .description("Created account and joined DSA Visualizer.")
                .createdAt(LocalDateTime.now())
                .build());

        return new MessageResponse("User registered successfully!");
    }

    private void updateUserStreak(User user) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastActive = user.getLastActiveDate();

        if (lastActive != null) {
            long daysBetween = java.time.temporal.ChronoUnit.DAYS.between(lastActive.toLocalDate(), now.toLocalDate());
            if (daysBetween == 1) {
                user.setStreakCount(user.getStreakCount() + 1);
            } else if (daysBetween > 1) {
                user.setStreakCount(1); // Streak broken, reset
            }
        } else {
            user.setStreakCount(1);
        }
        user.setLastActiveDate(now);
        userRepository.save(user);
    }

    public UserDto getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .streakCount(user.getStreakCount())
                .lastActiveDate(user.getLastActiveDate())
                .createdAt(user.getCreatedAt())
                .roles(user.getRoles().stream().map(r -> r.getName()).collect(Collectors.toList()))
                .build();
    }
}
