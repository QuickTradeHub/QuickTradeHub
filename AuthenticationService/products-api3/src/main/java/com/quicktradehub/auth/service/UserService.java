package com.quicktradehub.auth.service;

import com.quicktradehub.auth.dto.UserDTO;

import java.util.List;

public interface UserService {

    // Method to get a list of all users
    List<UserDTO> getAllUsers();

    // Method to get a specific user by their ID
    UserDTO getUserById(Long id);

    // Method to update user details
    UserDTO updateUser(UserDTO userDTO);

    // Method to delete a user by their ID
    boolean deleteUser(Long id);

    // Method to check if a user exists by their email
    boolean existsByEmail(String email);
}
