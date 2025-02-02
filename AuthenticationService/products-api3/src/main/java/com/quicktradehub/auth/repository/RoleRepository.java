package com.quicktradehub.auth.repository;

import com.quicktradehub.auth.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    // Custom query to find a role by its name
    Optional<Role> findByName(String name);
}
