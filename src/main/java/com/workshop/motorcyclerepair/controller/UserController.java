package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.user.UpdateUserRequestDTO;
import com.workshop.motorcyclerepair.dto.user.UserDTO;
import com.workshop.motorcyclerepair.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/user")
@AllArgsConstructor
@Tag(name = "User", description = "Handles operations related to user management, including retrieval and updates.")
public class UserController {

    private final UserService userService;

    @PreAuthorize("@roleChecker.hasRole({'ADMIN'})")
    @GetMapping("/")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @PreAuthorize("@roleChecker.hasAnyRole({'ADMIN', 'ACCEPTANCE_AGENT', 'MECHANIC', 'WAREHOUSE_WORKER', 'CASHIER'})")
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserByID(@PathVariable Long userId) {
        return ResponseEntity.ok().body(userService.getUserById(userId));
    }

    @PreAuthorize("@roleChecker.hasRole({'ADMIN'})")
    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequestDTO updateUserRequestDTO) {
        return ResponseEntity.ok().body(userService.updateUser(userId, updateUserRequestDTO));
    }

}
