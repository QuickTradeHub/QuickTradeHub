package com.quicktradehub.auth.repository;

import com.quicktradehub.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query to find a user by their username
    Optional<User> findByUsername(String username);

    // Custom query to find a user by their email
    Optional<User> findByEmail(String email);

    // Custom query to find a user by their id
    Optional<User> findById(Long id);

    // Custom query to check if a user exists by their username
    Boolean existsByUsername(String username);

    // Custom query to check if a user exists by their email
    Boolean existsByEmail(String email);
}
