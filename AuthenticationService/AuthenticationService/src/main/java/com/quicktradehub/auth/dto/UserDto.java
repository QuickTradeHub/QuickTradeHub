package com.quicktradehub.auth.dto;

import com.quicktradehub.auth.entity.User;
import com.quicktradehub.auth.entity.Address;
import com.quicktradehub.auth.entity.Role;
import com.quicktradehub.auth.entity.Status;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    private int userId;
    private String userName;
    private String firstName;
    private String lastName;
    private String email;
    private String password; // Hashed password
    private String phone;
    private Status status;
    private byte[] profileImg;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastLogin;
    private Set<Address> addresses;
    private Set<Role> roles;

    // Constructor to map from Entity to DTO
    public UserDto(User user) {
        this.userId = user.getUserId();
        this.userName = user.getUserName();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.phone = user.getPhone();
        this.status = user.getStatus();
        this.profileImg = user.getProfileImg();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
        this.lastLogin = user.getLastLogin();
        this.addresses = user.getAddresses();
        this.roles = user.getRoles();
    }

    
    public User toEntity() {
        return User.builder()
                .userId(this.userId)
                .userName(this.userName)
                .firstName(this.firstName)
                .lastName(this.lastName)
                .email(this.email)
                .password(this.password)
                .phone(this.phone)
                .status(this.status)
                .profileImg(this.profileImg)
                .createdAt(this.createdAt)
                .updatedAt(this.updatedAt)
                .lastLogin(this.lastLogin)
                .addresses(this.addresses)
                .roles(this.roles)
                .build();
    }
}
