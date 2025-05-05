package com.workshop.motorcyclerepair.service.security;

import com.workshop.motorcyclerepair.dto.UserDTO;
import com.workshop.motorcyclerepair.dto.security.LoginRequestDTO;
import com.workshop.motorcyclerepair.dto.security.LoginResponseDTO;
import com.workshop.motorcyclerepair.dto.security.RegisterRequestDTO;
import com.workshop.motorcyclerepair.mapper.UserMapper;
import com.workshop.motorcyclerepair.model.User;
import com.workshop.motorcyclerepair.repository.UserRepository;
import com.workshop.motorcyclerepair.utils.Role;
import lombok.AllArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private UserRepository userRepository;
    private final UserMapper userMapper = UserMapper.INSTANCE;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequestDTO.username(), loginRequestDTO.password())
        );

        org.springframework.security.core.userdetails.User user = (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        User userToCreateToken = new User();
        userToCreateToken.setUsername(user.getUsername());
        userToCreateToken.setRole(Role.getAuthority(user.getAuthorities().toArray()[0].toString()));

        String token = jwtService.generateToken(userToCreateToken);  // Genera il JWT token

        return new LoginResponseDTO(token);
    }

    public UserDTO registerUser(RegisterRequestDTO registerRequestDTO) {
        if(userRepository.findByUsernameOrEmail(registerRequestDTO.username(), registerRequestDTO.email()).isPresent()) {
            throw new IllegalArgumentException("This user already exists!");
        }

        return userMapper.toDto(userRepository.save(User.builder()
                .username(registerRequestDTO.username())
                .password(passwordEncoder.encode(registerRequestDTO.password()))
                .firstName(registerRequestDTO.firstName())
                .lastName(registerRequestDTO.lastName())
                .email(registerRequestDTO.email())
                .role(Role.USER)
                .build()
        ));
    }

    public UserDTO getProfile(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Hello"));
        return userMapper.toDto(user);
    }

}
