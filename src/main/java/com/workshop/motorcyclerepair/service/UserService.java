package com.workshop.motorcyclerepair.service;

import com.workshop.motorcyclerepair.dto.UpdateUserRequest;
import com.workshop.motorcyclerepair.dto.UserDTO;
import com.workshop.motorcyclerepair.mapper.UserMapper;
import com.workshop.motorcyclerepair.model.User;
import com.workshop.motorcyclerepair.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper = UserMapper.INSTANCE;
    private final PasswordEncoder passwordEncoder;


    public UserDTO getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return userMapper.toDto(user);
    }

    public UserDTO updateUser(Long userId, UpdateUserRequest updateUserRequest) {
        User updatedUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if(!Objects.isNull(updateUserRequest.username())) {
            updatedUser.setUsername(updateUserRequest.username());
        }

        if(!Objects.isNull(updateUserRequest.password())) {
            updatedUser.setPassword(passwordEncoder.encode(updateUserRequest.password()));
        }

        if(!Objects.isNull(updateUserRequest.email())) {
            updatedUser.setEmail(updateUserRequest.email());
        }

        if(!Objects.isNull(updateUserRequest.firstName())) {
            updatedUser.setFirstName(updateUserRequest.firstName());
        }

        if(!Objects.isNull(updateUserRequest.lastName())) {
            updatedUser.setLastName(updateUserRequest.lastName());
        }

        if(!Objects.isNull(updateUserRequest.role())) {
            updatedUser.setRole(updateUserRequest.role());
        }

        return userMapper.toDto(userRepository.save(updatedUser));
    }

}
