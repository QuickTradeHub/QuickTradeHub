package com.quicktradehub.auth.service.impl;

import com.quicktradehub.auth.dto.UserDto;
import com.quicktradehub.auth.dto.LoginRequest;
import com.quicktradehub.auth.dto.AddressDto;
import com.quicktradehub.auth.dto.ForgotPasswordDto;
import com.quicktradehub.auth.dto.PasswordResetRequest;
import com.quicktradehub.auth.entity.Address;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.repository.AddressRepository;
import com.quicktradehub.auth.repository.UserRepository;
import com.quicktradehub.auth.service.UserService;
import com.quicktradehub.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.RestClientException;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final JwtUtil jwtUtil;
    @Autowired
    private final BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private final AddressRepository addressRepository;
    @Autowired
    private RestTemplate restTemplate;

    @Override
    public UserDto registerUser(UserDto userDto) {
        // Check if the user already exists by email
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new RuntimeException("User already exists with email: " + userDto.getEmail());
        }
        // Check if the username is already taken
        if (userRepository.existsByUserName(userDto.getUserName())) {
            throw new RuntimeException("Username " + userDto.getUserName() + " has been already taken, try a different one.");
        }
        // Encode the password before saving
        userDto.setPassword(passwordEncoder.encode(userDto.getPassword()));

        // Convert DTO to Entity and save
        User user = userDto.toEntity();
        if (user.getAddresses() != null) {
            for (Address address : user.getAddresses()) {
                address.setUser(user);
            }
        }

        User savedUser = userRepository.save(user);

        // Attempt to send registration confirmation email
        sendEmail(user.getEmail(), user.getUserName(), "account-registration");

        // Return saved user as DTO
        return new UserDto(savedUser);
    }

    @Override
    public boolean validateToken(String token, String userName) {
        // Validate JWT token against username
        return jwtUtil.validateToken(token, userName);
    }

    @Override
    public boolean resetPassword(PasswordResetRequest request, String token) {
        // Fetch user by username extracted from token
        Optional<User> userOptional = userRepository.findByUserName(jwtUtil.extractUsername(token));
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found for the provided token.");
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Attempt to send password reset confirmation email
        sendEmail(user.getEmail(), "Password reset successfully.", "user-activity");

        return true;
    }

    @Override
    public List<UserDto> getAllUsers() {
        // Retrieve and return all users as DTOs
        List<User> users = userRepository.findAll();
        return users.stream().map(UserDto::new).collect(Collectors.toList());
    }

    @Override
    public Optional<UserDto> getUserById(Integer userId) {
        // Retrieve user by ID and return as DTO
        Optional<User> userOptional = userRepository.findById(userId);
        return userOptional.map(UserDto::new);
    }

    @Override
    public UserDto updateUser(UserDto userDto) {
        // Find user by ID and update details
        Optional<User> userOptional = userRepository.findById(userDto.getUserId());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with id: " + userDto.getUserId());
        }

        User user = userOptional.get();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword())); // Re-encode password

        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser);
    }

    @Override
    public boolean deleteUser(Integer userId) {
        // Delete user by ID if exists
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            userRepository.delete(userOptional.get());
            return true;
        }
        return false;
    }

    @Override
    public User authenticateUser(LoginRequest loginRequest) {
        // Authenticate user by email and password
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with email: " + loginRequest.getEmail());
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials. Password does not match.");
        }

        // Attempt to send login activity email
        sendEmail(loginRequest.getEmail(), "New login detected to your account", "user-activity");

        return user;
    }

    @Override
    public void sendPasswordResetLink(ForgotPasswordDto forgotPasswordDto) {
        // Generate and send password reset link to user
        Optional<User> userOptional = userRepository.findByEmail(forgotPasswordDto.getEmail());
        if (!userOptional.isPresent()) {
            throw new RuntimeException("User not found with email: " + forgotPasswordDto.getEmail());
        }

        User user = userOptional.get();
        String token = jwtUtil.generateToken(user);
        String resetLink = "http://13.49.119.218/reset-password?token=" + token;

        // Attempt to send password reset email
        sendEmail(user.getEmail(), resetLink, "password-reset");
    }

    // Helper method to send emails with error handling if notification service fails
    public void sendEmail(String recipient, String messageBody, String endPoint) {
        String notificationServiceUrl = "http://notification-service/notifications/" + endPoint;

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("recipient", recipient);
        requestBody.put("messageBody", messageBody);

        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody);

        try {
            restTemplate.postForEntity(notificationServiceUrl, requestEntity, String.class);
        } catch (RestClientException e) {
            System.err.println("Failed to send email to " + recipient + ". Error: " + e.getMessage());
        }
    }

    @Override
    public void addAddressToUser(int userId, AddressDto addressDto) {
        // Add address to a specific user
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));

        Address address = new Address();
        address.setStreet(addressDto.getStreet());
        address.setCity(addressDto.getCity());
        address.setState(addressDto.getState());
        address.setZipCode(addressDto.getZipCode());
        address.setCountry(addressDto.getCountry());
        address.setPrimary(addressDto.isPrimary());
        address.setUser(user);

        addressRepository.save(address);
    }

    @Override
    public List<AddressDto> getUserAddresses(int userId) {
        // Retrieve all addresses associated with a user
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getAddresses().stream().map(AddressDto::new).collect(Collectors.toList());
    }
}
