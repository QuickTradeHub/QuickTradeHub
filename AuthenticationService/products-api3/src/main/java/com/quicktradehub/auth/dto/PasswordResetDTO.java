package com.quicktradehub.auth.dto;

import lombok.Data;

@Data
public class PasswordResetDTO {

    private String token;
    private String newPassword;

    // Lombok will automatically generate the constructor, getters, setters, toString, equals, and hashcode methods
}
