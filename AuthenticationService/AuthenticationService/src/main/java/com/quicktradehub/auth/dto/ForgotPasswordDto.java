package com.quicktradehub.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class ForgotPasswordDto {

    private String email;  // The email of the user who wants to reset the password

}
