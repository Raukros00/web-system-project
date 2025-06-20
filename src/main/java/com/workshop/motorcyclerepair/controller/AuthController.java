package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.security.LoginRequestDTO;
import com.workshop.motorcyclerepair.dto.security.LoginResponseDTO;
import com.workshop.motorcyclerepair.dto.security.RegisterRequestDTO;
import com.workshop.motorcyclerepair.dto.user.UserDTO;
import com.workshop.motorcyclerepair.service.security.AuthService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    @PreAuthorize("@roleChecker.hasRole({'ADMIN'})")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequestDTO) {
        return ResponseEntity.ok().body(authService.registerUser(registerRequestDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return ResponseEntity.ok().body(authService.login(loginRequestDTO));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        return ResponseEntity.ok().body(authService.getProfile(authentication.getName()));
    }
}
