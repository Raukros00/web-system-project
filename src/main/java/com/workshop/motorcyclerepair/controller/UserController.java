package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.UpdateUserRequest;
import com.workshop.motorcyclerepair.dto.UserDTO;
import com.workshop.motorcyclerepair.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/user")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    @PreAuthorize("@roleChecker.hasAnyRole({'ADMIN', 'ACCEPTANCE_AGENT', 'MECHANIC'})")
    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUserByID(@PathVariable Long userId) {
        return ResponseEntity.ok().body(userService.getUserById(userId));
    }

    @PreAuthorize("@roleChecker.hasRole({'ADMIN'})")
    @PatchMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long userId, @RequestBody UpdateUserRequest updateUserRequest) {
        return ResponseEntity.ok().body(userService.updateUser(userId, updateUserRequest));
    }


}
