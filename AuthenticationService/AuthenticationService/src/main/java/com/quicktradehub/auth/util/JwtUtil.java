package com.quicktradehub.auth.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.quicktradehub.auth.entity.User;

import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "your-secret-key"; // Use a secure key

    // Generate JWT token for a User object
    public String generateToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY); // Set the signing algorithm with secret key

        return JWT.create()
                .withSubject(user.getUserName()) // Set the subject (username)
                .withClaim("userId", user.getUserId()) // Add userId as claim
                .withClaim("email", user.getEmail()) // Add email as claim
                .withClaim("phone", user.getPhone()) // Add phone as claim
                .withIssuedAt(new Date()) // Set the issue date
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // Set expiration time (10 hours)
                .sign(algorithm); // Sign the token with the algorithm
    }

    // Validate JWT token
    public boolean validateToken(String token, String username) {
        return username.equals(extractUsername(token)) && !isTokenExpired(token);  // Validate by checking username and expiration
    }

    // Extract username from the token
    public String extractUsername(String token) {
        return extractClaim(token, DecodedJWT::getSubject); // Extract subject (username) from the token
    }

    // Extract any claim from the token
    public <T> T extractClaim(String token, ClaimExtractor<T> claimsResolver) {
        DecodedJWT decodedJWT = decodeToken(token);  // Decode the token
        return claimsResolver.extract(decodedJWT);  // Apply the claims resolver (extract specific claim)
    }

    // Decode the token and return the DecodedJWT
    private DecodedJWT decodeToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
        JWTVerifier verifier = JWT.require(algorithm).build(); // Create a verifier with the algorithm
        return verifier.verify(token);  // Verify and decode the token
    }

    // Check if the token is expired
    private boolean isTokenExpired(String token) {
        return extractClaim(token, DecodedJWT::getExpiresAt).before(new Date()); // Check if expiration date is before current date
    }

    // Functional interface for claim extraction
    @FunctionalInterface
    public interface ClaimExtractor<T> {
        T extract(DecodedJWT decodedJWT);
    }
}
