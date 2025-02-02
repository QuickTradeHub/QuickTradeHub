package com.quicktradehub.auth.dto;

import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String phoneNumber;

    // Lombok will automatically generate the constructor, getters, setters, toString, equals, and hashcode methods
}
