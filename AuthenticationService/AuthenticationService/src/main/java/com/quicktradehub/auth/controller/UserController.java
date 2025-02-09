package com.quicktradehub.auth.controller;

import com.quicktradehub.auth.dto.*;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.service.UserService;
import com.quicktradehub.auth.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

import java.util.List;

@RestController
@RequestMapping("/auth")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

  
    public UserController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // Register a new user
    @PostMapping("/register")
    public ResponseEntity<Map> register(@RequestBody UserDto userDto) {
        User user = userService.registerUser(userDto).toEntity();
        Map<String,String> response = new HashMap<>();
        response.put("message","User registered successfully with ID: " + user.getUserId());
        return ResponseEntity.ok(response);
    }

    // Login and generate JWT token
    @PostMapping("/login")
    public ResponseEntity<Map> login(@RequestBody LoginRequest loginRequestDto) {
        User user = userService.authenticateUser(loginRequestDto);
        String token = jwtUtil.generateToken(user);
        Map<String,Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", user);
        return ResponseEntity.ok(response); // Return token in response
    }

    // Validate JWT token
    @GetMapping("/validate")
    public ResponseEntity<String> validateToken(@RequestHeader("Authorization") String token) {
        String jwtToken = token.substring(7); // Extract token from Bearer token
        if (jwtUtil.validateToken(jwtToken, jwtUtil.extractUsername(jwtToken))) {
            return ResponseEntity.ok("Token is valid.");
        }
        return ResponseEntity.status(401).body("Token is invalid.");
    }

    // Forgot password (send password reset link via email)
    @PostMapping("/forgot-password")
    public ResponseEntity<Map> forgotPassword(@RequestBody ForgotPasswordDto requestDto) {
        userService.sendPasswordResetLink(requestDto);
        Map<String,String> response = new HashMap<>();
        response.put("message", "Password reset link sent.");
        return ResponseEntity.ok(response);
    }

    // Reset password
    @PostMapping("/reset-password")
    public ResponseEntity<Map> resetPassword(@RequestBody PasswordResetRequest requestDto) {
        userService.resetPassword(requestDto,requestDto.getToken());
        Map<String, String> response = new HashMap<>();
        response.put("message", "Password reset successfully.");
        return ResponseEntity.ok(response);
    }

    // Get all registered users (admin access)
    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // Get user by ID
    @GetMapping("/user/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable int id) {
        UserDto userDto = userService.getUserById(id).orElse(null);
        return ResponseEntity.ok(userDto);
    }

    // Update user details
    @PutMapping("/user/update")
    public ResponseEntity<String> updateUser(@RequestBody UserDto userDto) {
        userService.updateUser(userDto);
        return ResponseEntity.ok("User updated successfully.");
    }

    // Delete user account (admin access)
    @DeleteMapping("/user/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully.");
    }
    
    // Add Address to User
    @PostMapping("/user/{id}/address")
    public ResponseEntity<String> addAddress(@PathVariable int id, @RequestBody AddressDto addressDto) {
        userService.addAddressToUser(id, addressDto);
        return ResponseEntity.ok("Address added successfully for user ID: " + id);
    }
    
    @GetMapping("/user/{id}/address")
    public ResponseEntity<List<AddressDto>> getUserAddresses(@PathVariable int id) {
        List<AddressDto> addresses = userService.getUserAddresses(id);
        return ResponseEntity.ok(addresses);
    }
}
