package com.quicktradehub.auth.security;

import com.quicktradehub.auth.entity.User;
import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JWTTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    @Value("${jwt.reset-token-expiration}")
    private long resetTokenExpiration;

    // Generate JWT Token for a user
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Generate JWT Token for password reset
    public String generatePasswordResetToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + resetTokenExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    // Validate JWT Token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            // Invalid token, return false
            return false;
        }
    }

    // Get User email from the JWT token
    public String getUserEmailFromToken(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject();
    }

    // Extract username from JWT token (for authentication)
    public UserDetails getUserDetailsFromToken(String token) {
        String username = getUserEmailFromToken(token);
        // You can replace this with your custom UserDetails service logic
        return org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password("") // Not needed for JWT-based auth
                .authorities("USER") // Set appropriate roles
                .build();
    }

    // Validate password reset token
    public boolean validatePasswordResetToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(jwtSecret)
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException | UnsupportedJwtException | IllegalArgumentException e) {
            // Invalid token, return false
            return false;
        }
    }

    // Get User from password reset token
    public User getUserFromPasswordResetToken(String token) {
        String email = getUserEmailFromToken(token);
        // Fetch user from database using the email
        // You can replace this with your user fetching logic
        return new User(email);
    }
}
