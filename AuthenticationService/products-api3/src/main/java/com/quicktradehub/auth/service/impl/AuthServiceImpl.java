package com.quicktradehub.auth.service.impl;

import com.quicktradehub.auth.dto.LoginDTO;
import com.quicktradehub.auth.dto.PasswordResetDTO;
import com.quicktradehub.auth.dto.UserDTO;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.entity.Role;
import com.quicktradehub.auth.repository.UserRepository;
import com.quicktradehub.auth.repository.RoleRepository;
import com.quicktradehub.auth.security.JWTTokenProvider;
import com.quicktradehub.auth.utils.EmailSender;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.quicktradehub.auth.service.AuthService;

import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JWTTokenProvider jwtTokenProvider;
    private final EmailSender emailSender;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, RoleRepository roleRepository,
                           BCryptPasswordEncoder passwordEncoder, JWTTokenProvider jwtTokenProvider,
                           EmailSender emailSender) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.emailSender = emailSender;
    }

    @Override
    public UserDTO register(UserDTO userDTO) {
        // Check if user already exists
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Create new User entity
        User user = new User();
        user.setName(userDTO.getFullName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Encrypt password

        // Set default role (USER)
        Optional<Role> userRole = roleRepository.findByName("ROLE_USER");
        userRole.ifPresent(role -> user.setRoles(Set.of(role)));

        // Save user to the database
        userRepository.save(user);

        return new UserDTO(user.getId(), user.getFullName(), user.getEmail(), user.getRoles());
    }

    @Override
    public String login(LoginDTO loginDTO) {
        // Authenticate user
        Optional<User> userOpt = userRepository.findByEmail(loginDTO.getEmail());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (passwordEncoder.matches(loginDTO.getPassword(), user.getPassword())) {
                // Generate JWT token
                return jwtTokenProvider.generateToken(user);
            } else {
                throw new RuntimeException("Invalid credentials");
            }
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    @Override
    public void sendPasswordResetLink(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            String token = jwtTokenProvider.generatePasswordResetToken(userOpt.get());
            // Send email with reset link (token)
            String resetLink = "http://localhost:8080/auth/reset-password?token=" + token;
            emailSender.sendPasswordResetEmail(email, resetLink);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public void resetPassword(PasswordResetDTO passwordResetDTO) {
        // Verify password reset token
        if (jwtTokenProvider.validatePasswordResetToken(passwordResetDTO.getToken())) {
            User user = jwtTokenProvider.getUserFromPasswordResetToken(passwordResetDTO.getToken());
            user.setPassword(passwordEncoder.encode(passwordResetDTO.getPassword())); // Encrypt new password
            userRepository.save(user);
        } else {
            throw new RuntimeException("Invalid or expired token");
        }
    }

    @Override
    public UserDTO getUserById(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        return userOpt.map(user -> new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRoles())).orElse(null);
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        Optional<User> userOpt = userRepository.findById(userDTO.getId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setName(userDTO.getName());
            user.setEmail(userDTO.getEmail());
            // Optionally update password if provided
            if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            }
            userRepository.save(user);
            return new UserDTO(user.getId(), user.getName(), user.getEmail(), user.getRoles());
        } else {
            throw new RuntimeException("User not found");
        }
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
