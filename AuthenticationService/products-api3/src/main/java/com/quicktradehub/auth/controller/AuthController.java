package com.quicktradehub.auth.controller;

import com.quicktradehub.auth.dto.UserDTO;
import com.quicktradehub.auth.dto.PasswordResetDTO;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.service.AuthService;
import com.quicktradehub.auth.service.UserService;
import com.quicktradehub.auth.utils.EmailSender;
import com.quicktradehub.auth.security.JWTUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailSender emailSender;

    @Autowired
    private JWTUtil jwtUtil;

    // User registration endpoint
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserDTO userDTO) {
        UserDTO newUser = authService.registerUser(userDTO);
        return ResponseEntity.ok("User registered successfully!");
    }

    // User login endpoint to authenticate and generate JWT
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserDTO userDTO) {
        String token = authService.loginUser(userDTO);
        return ResponseEntity.ok().header("Authorization", "Bearer " + token)
                             .body("Login successful!");
    }

    // JWT token validation endpoint
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        boolean isValid = jwtUtil.isTokenValid(token);
        if (isValid) {
            return ResponseEntity.ok("Token is valid");
        } else {
            return ResponseEntity.status(401).body("Token is invalid or expired");
        }
    }

    // Forgot password endpoint to send reset link
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody String email) {
        boolean isSent = emailSender.sendPasswordResetLink(email);
        if (isSent) {
            return ResponseEntity.ok("Password reset link sent successfully.");
        } else {
            return ResponseEntity.status(400).body("Email not found.");
        }
    }

    // Reset password endpoint
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDTO passwordResetDTO) {
        boolean isReset = authService.resetPassword(passwordResetDTO);
        if (isReset) {
            return ResponseEntity.ok("Password reset successful.");
        } else {
            return ResponseEntity.status(400).body("Invalid reset token or expired.");
        }
    }

    // Admin access: Get all registered users
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    // Fetch specific user by ID
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }

    // Update user details
    @PutMapping("/user/update")
    public ResponseEntity<?> updateUser(@RequestBody UserDTO userDTO) {
        User updatedUser = userService.updateUser(userDTO);
        return ResponseEntity.ok("User details updated successfully.");
    }

    // Admin access: Delete user by ID
    @DeleteMapping("/user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean isDeleted = userService.deleteUser(id);
        if (isDeleted) {
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("User not found.");
        }
    }
}
