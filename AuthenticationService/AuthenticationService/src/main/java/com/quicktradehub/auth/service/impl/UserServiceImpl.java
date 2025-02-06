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
		// Check if the user already exists
		if (userRepository.existsByEmail(userDto.getEmail())) {
			throw new RuntimeException("User already exists with email: " + userDto.getEmail());
		}
		if(userRepository.existsByUserName(userDto.getUserName())) {
			throw new RuntimeException("Username "+userDto.getUserName() +" has been already taken try different" );
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
		
		sendEmail(user.getEmail(), user.getUserName(), "account-registration");

		// Return saved user as DTO
		return new UserDto(savedUser);
	}



	@Override
	public boolean validateToken(String token, String userName) {
		return jwtUtil.validateToken(token, userName);
	}



	@Override
	public boolean resetPassword(PasswordResetRequest request,String token) {
//		   if (jwtUtil.isTokenBlacklisted(token)) {
//		        throw new RuntimeException("Token has been invalidated.");
//		    }
		Optional<User> userOptional = userRepository.findByUserName(jwtUtil.extractUsername(token));

		User user = userOptional.get();
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
		sendEmail(user.getEmail(), "password reset successfully.", "user-activity");
//		jwtUtil.blacklistToken(token);
		return true;
	}

	@Override
	public List<UserDto> getAllUsers() {
		List<User> users = userRepository.findAll();
		// Convert entities to DTOs
		return users.stream().map(UserDto::new).toList();
	}

	@Override
	public Optional<UserDto> getUserById(Integer userId) {
		Optional<User> userOptional = userRepository.findById(userId);
		if (userOptional.isPresent()) {
			return Optional.of(new UserDto(userOptional.get()));
		}
		return Optional.empty();
	}

	@Override
	public UserDto updateUser(UserDto userDto) {
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
		Optional<User> userOptional = userRepository.findById(userId);
		if (userOptional.isPresent()) {
			userRepository.delete(userOptional.get());
			return true;
		}
		return false;
	}

	
	@Override
	public User authenticateUser(LoginRequest loginRequest) {
		Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
		if (!userOptional.isPresent()) {
			throw new RuntimeException("User not found with email: " + loginRequest.getEmail());
		}

		User user = userOptional.get();
		System.out.println(user);
		

		// Validate password
		if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
		    throw new RuntimeException("Invalid credentials. Password does not match.");
		}

		sendEmail(loginRequest.getEmail(), "New login detected to your account", "user-activity");

		return user;
	}

	@Override
	public void sendPasswordResetLink(ForgotPasswordDto forgotPasswordDto) {
		// Fetch user by email
		Optional<User> userOptional = userRepository.findByEmail(forgotPasswordDto.getEmail());
		if (!userOptional.isPresent()) {
			throw new RuntimeException("User not found with email: " + forgotPasswordDto.getEmail());
		}

		User user = userOptional.get();

		// Generate a password reset token (using JWT)
		String token = jwtUtil.generateToken(user);


		String resetLink = "http://13.49.119.218/reset-password?token=" + token;

		// Send email with the reset link (using NotificationService)
		sendEmail(user.getEmail(), resetLink,"password-reset");
	}

	// Helper method to send the email
	public void sendEmail(String recipient, String messageBody,String endPoint) {
        String notificationServiceUrl = "http://notification-service/notifications/"+endPoint;

        // Creating request body
        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("recipient", recipient);
        requestBody.put("messageBody", messageBody);
        
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(requestBody);

        // Making REST API call
        ResponseEntity<String> response = restTemplate.postForEntity(notificationServiceUrl, requestEntity, String.class);

    }

	 public void addAddressToUser(int userId, AddressDto addressDto) {
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
	 
	    public List<AddressDto> getUserAddresses(int userId) {
	        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
	        return user.getAddresses().stream().map(address -> new AddressDto(address)).collect(Collectors.toList());
	    }
}
