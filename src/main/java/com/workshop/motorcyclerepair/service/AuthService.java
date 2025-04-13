package com.workshop.motorcyclerepair.service;

import com.workshop.motorcyclerepair.dto.UserDTO;
import com.workshop.motorcyclerepair.mapper.UserMapper;
import com.workshop.motorcyclerepair.model.User;
import com.workshop.motorcyclerepair.repository.UserRepository;
import com.workshop.motorcyclerepair.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    private final UserMapper userMapper = UserMapper.INSTANCE;
    private final BCryptPasswordEncoder cryptPasswordEncoder = new BCryptPasswordEncoder();

    public boolean register(UserDTO userDTO) {
        /*Optional.ofNullable(userRepository.findByEmail(userDTO.getEmail()))
                .ifPresent(existingUser -> {
                    throw new RuntimeException();
                }
        );*/

        User newUser = userMapper.toEntity(userDTO);
        newUser.setRole(Role.USER);
        newUser.setPassword(cryptPasswordEncoder.encode(userDTO.getPassword()));

        userRepository.save(newUser);
        return true;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return (UserDetails) userRepository.findByUsername(username)
                .orElseThrow(()->new UsernameNotFoundException("Username not found"));    }
}
