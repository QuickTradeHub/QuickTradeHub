package com.quicktradehub.auth.service;

import com.quicktradehub.auth.dto.LoginDTO;
import com.quicktradehub.auth.dto.PasswordResetDTO;
import com.quicktradehub.auth.dto.UserDTO;

public interface AuthService {

    // Method to register a new user
    UserDTO register(UserDTO userDTO);

    // Method to authenticate a user and return a JWT token
    String login(LoginDTO loginDTO);

    // Method to validate the JWT token
    boolean validateToken(String token);

    // Method to send a password reset link to the user's email
    void sendPasswordResetLink(String email);

    // Method to reset the user's password
    boolean resetPassword(PasswordResetDTO passwordResetDTO);

    // Method to fetch a user by their ID
    UserDTO getUserById(Long id);

    // Method to update user details
    UserDTO updateUser(UserDTO userDTO);

    // Method to delete a user by their ID (admin only)
    void deleteUser(Long id);
}
