package com.quicktradehub.auth.service.impl;

import com.quicktradehub.auth.dto.UserDTO;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.repository.UserRepository;
import com.quicktradehub.auth.mapper.UserMapper;
import com.quicktradehub.auth.exception.ResourceNotFoundException; // Custom exception for user not found
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.quicktradehub.auth.service.UserService;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserDTO getUserById(Long id) {
        // Fetch user by ID and convert to DTO
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return userMapper.toDTO(user.get());
        } else {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
    }

    @Override
    public UserDTO updateUser(UserDTO userDTO) {
        // Check if user exists by ID
        Optional<User> existingUser = userRepository.findById(userDTO.getId());
        if (existingUser.isPresent()) {
            // Update user with the provided data
            User user = existingUser.get();
            user.setFullName(userDTO.getFullName());
            user.setEmail(userDTO.getEmail());
            // Update additional user fields as needed
            
            // Save and return the updated user as a DTO
            userRepository.save(user);
            return userMapper.toDTO(user);
        } else {
            throw new ResourceNotFoundException("User not found with ID: " + userDTO.getId());
        }
    }

    @Override
    public boolean deleteUser(Long id) {
        // Check if the user exists before attempting to delete
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            userRepository.deleteById(id);
            return true;
        } else {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
    }

    @Override
    public boolean existsByEmail(String email) {
        // Check if user exists by email
        return userRepository.existsByEmail(email);
    }

	@Override
	public List<UserDTO> getAllUsers() {
		// TODO Auto-generated method stub
		return null;
	}
}
