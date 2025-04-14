package com.workshop.motorcyclerepair.service;

import com.workshop.motorcyclerepair.dto.UpdateUserRequestDTO;
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

    public UserDTO updateUser(Long userId, UpdateUserRequestDTO updateUserRequestDTO) {
        User updatedUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if(!Objects.isNull(updateUserRequestDTO.username())) {
            updatedUser.setUsername(updateUserRequestDTO.username());
        }

        if(!Objects.isNull(updateUserRequestDTO.password())) {
            updatedUser.setPassword(passwordEncoder.encode(updateUserRequestDTO.password()));
        }

        if(!Objects.isNull(updateUserRequestDTO.email())) {
            updatedUser.setEmail(updateUserRequestDTO.email());
        }

        if(!Objects.isNull(updateUserRequestDTO.firstName())) {
            updatedUser.setFirstName(updateUserRequestDTO.firstName());
        }

        if(!Objects.isNull(updateUserRequestDTO.lastName())) {
            updatedUser.setLastName(updateUserRequestDTO.lastName());
        }

        if(!Objects.isNull(updateUserRequestDTO.role())) {
            updatedUser.setRole(updateUserRequestDTO.role());
        }

        return userMapper.toDto(userRepository.save(updatedUser));
    }

}
