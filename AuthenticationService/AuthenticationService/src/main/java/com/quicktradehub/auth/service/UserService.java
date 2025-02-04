package com.quicktradehub.auth.service;

import com.quicktradehub.auth.dto.UserDto;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.dto.LoginRequest;
import com.quicktradehub.auth.dto.AddressDto;
import com.quicktradehub.auth.dto.ForgotPasswordDto;
import com.quicktradehub.auth.dto.JwtResponse;
import com.quicktradehub.auth.dto.PasswordResetRequest;
import java.util.List;
import java.util.Optional;

public interface UserService {

    // Register a new user
    UserDto registerUser(UserDto userDto);

    // Validate the JWT token
    boolean validateToken(String token,String userName);


    // Reset the user's password
    boolean resetPassword(PasswordResetRequest request,String token);

    // Get a list of all registered users (admin access)
    List<UserDto> getAllUsers();

    // Fetch details of a specific user by ID
    Optional<UserDto> getUserById(Integer userId);

    // Update user details
    UserDto updateUser(UserDto userDto);

    // Delete a user account (admin access)
    boolean deleteUser(Integer userId);
    
    //Authenticate the user
    User authenticateUser(LoginRequest loginRequest);
    
    //Send Password Reset Link
    void sendPasswordResetLink(ForgotPasswordDto forgotPasswordDto);
    
     void addAddressToUser(int userId, AddressDto addressDto);
     
     List<AddressDto> getUserAddresses(int userId);
    

}
