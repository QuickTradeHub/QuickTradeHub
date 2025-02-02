package com.quicktradehub.auth.service.impl;

import com.quicktradehub.auth.dto.UserDto;
import com.quicktradehub.auth.dto.LoginRequest;
import com.quicktradehub.auth.dto.AddressDto;
import com.quicktradehub.auth.dto.ForgotPasswordDto;
import com.quicktradehub.auth.dto.JwtResponse;
import com.quicktradehub.auth.dto.PasswordResetRequest;
import com.quicktradehub.auth.entity.Address;
import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.repository.AddressRepository;
import com.quicktradehub.auth.repository.UserRepository;
import com.quicktradehub.auth.service.UserService;
import com.quicktradehub.auth.util.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
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

	@Override
	public UserDto registerUser(UserDto userDto) {
		// Check if the user already exists
		if (userRepository.existsByEmail(userDto.getEmail())) {
			throw new RuntimeException("User already exists with email: " + userDto.getEmail());
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

		// Return saved user as DTO
		return new UserDto(savedUser);
	}

	@Override
	public JwtResponse login(LoginRequest loginRequest) {
		// Find the user by email
		Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
		if (!userOptional.isPresent()
				|| !passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
			throw new RuntimeException("Invalid username or password");
		}

		// Generate JWT token
		User user = userOptional.get();
		String token = jwtUtil.generateToken(user);

		// Return JWT response with token
		return new JwtResponse(token);
	}

	@Override
	public boolean validateToken(String token, String userName) {
		return jwtUtil.validateToken(token, userName);
	}

	@Override
	public void forgotPassword(String email) {
		Optional<User> userOptional = userRepository.findByEmail(email);
		if (!userOptional.isPresent()) {
			throw new RuntimeException("User not found with email: " + email);
		}

		// Generate and send password reset link to user's email (implementation
		// omitted)
		// This could be an email with a password reset link
	}

	@Override
	public boolean resetPassword(PasswordResetRequest request) {
		Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
		if (!userOptional.isPresent()) {
			throw new RuntimeException("User not found with email: " + request.getEmail());
		}

		User user = userOptional.get();
		user.setPassword(passwordEncoder.encode(request.getNewPassword()));
		userRepository.save(user);
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

	// New authenticateUser method
	@Override
	public User authenticateUser(LoginRequest loginRequest) {
		Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());
		if (!userOptional.isPresent()) {
			throw new RuntimeException("User not found with email: " + loginRequest.getEmail());
		}

		User user = userOptional.get();
		System.out.println(user);

		// Validate password
//		if (!passwordEncoder.encode(loginRequest.getPassword()).equals(user.getPassword())) {
//			throw new RuntimeException("Invalid credentials. Password does not match.");
//		}

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

		// Construct password reset link (you might want to change the endpoint to your
		// own reset password page)
		String resetLink = "http://yourdomain.com/auth/reset-password?token=" + token;

		// Send email with the reset link (using JavaMailSender)
		sendResetEmail(user.getEmail(), resetLink);
	}

	// Helper method to send the reset password email
	private void sendResetEmail(String to, String resetLink) {

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
