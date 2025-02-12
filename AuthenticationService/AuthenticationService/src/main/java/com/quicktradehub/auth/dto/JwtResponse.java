package com.quicktradehub.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponse {

    private String token; // The JWT token itself
    private String tokenType = "Bearer"; // Type of token (usually "Bearer")
    private String username; // Username associated with the token
    
    public JwtResponse(String token){this.token = token;}

   
}
