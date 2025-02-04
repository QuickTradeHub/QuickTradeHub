package com.quicktradehub.auth.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.quicktradehub.auth.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.concurrent.TimeUnit;


@Component
public class JwtUtil {

    private final String SECRET_KEY = "your-secret-key"; // Use a secure key

    @Autowired
    private StringRedisTemplate redisTemplate; // Redis cache to store expired tokens

    // Generate JWT token for a User object
    public String generateToken(User user) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY); 

        return JWT.create()
                .withSubject(user.getUserName()) 
                .withClaim("userId", user.getUserId()) 
                .withClaim("email", user.getEmail()) 
                .withClaim("phone", user.getPhone()) 
                .withIssuedAt(new Date()) 
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours expiry
                .sign(algorithm);
    }

    // Validate JWT token (Check expiration + Blacklist)
    public boolean validateToken(String token, String username) {
        return username.equals(extractUsername(token)) && !isTokenExpired(token) && !isTokenBlacklisted(token);
    }

    // Extract username from the token
    public String extractUsername(String token) {
        return extractClaim(token, DecodedJWT::getSubject);
    }

    // Extract any claim from the token
    public <T> T extractClaim(String token, ClaimExtractor<T> claimsResolver) {
        DecodedJWT decodedJWT = decodeToken(token);
        return claimsResolver.extract(decodedJWT);
    }

    // Decode the token and return the DecodedJWT
    private DecodedJWT decodeToken(String token) {
        Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    // Check if the token is expired
    private boolean isTokenExpired(String token) {
        return extractClaim(token, DecodedJWT::getExpiresAt).before(new Date());
    }

    // Blacklist the token (Expire it manually)
    public void blacklistToken(String token) {
        long expiryTime = extractClaim(token, DecodedJWT::getExpiresAt).getTime();
        long currentTime = System.currentTimeMillis();
        long remainingTime = expiryTime - currentTime;

        if (remainingTime > 0) {
            redisTemplate.opsForValue().set(token, "blacklisted", remainingTime, TimeUnit.MILLISECONDS);
        }
    }

    // Check if the token is blacklisted
    public boolean isTokenBlacklisted(String token) {
        return redisTemplate.hasKey(token);
    }

    @FunctionalInterface
    public interface ClaimExtractor<T> {
        T extract(DecodedJWT decodedJWT);
    }
}
