package com.quicktradehub.auth.mapper;

import com.quicktradehub.auth.dto.UserDTO;
import com.quicktradehub.auth.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        return new UserDTO(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }

    public User toEntity(UserDTO userDTO) {
        return new User(userDTO.getId(), userDTO.getFullName(), userDTO.getEmail(), userDTO.getRole());
    }
}
