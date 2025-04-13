package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.UserDTO;
import com.workshop.motorcyclerepair.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/auth")
public class AuthController {

    //@PreAuthorize("@roleChecker.hasAnyRole({'ADMIN', 'MECHANIC'})")

    private final AuthService authService;
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/")
    public ResponseEntity<Boolean> registerUser(@Valid @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(authService.register(userDTO));
    }

    @PostMapping("/login")
    public boolean login() {

        return true;
    }

    @PreAuthorize("@roleChecker.hasAnyRole({'USER'})")
    @GetMapping("/hello-world")
    public String helloWorld() {
        return "hello-world";
    }

}
