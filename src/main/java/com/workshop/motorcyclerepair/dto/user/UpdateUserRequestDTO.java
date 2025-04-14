package com.workshop.motorcyclerepair.dto;

import com.workshop.motorcyclerepair.utils.Role;
import jakarta.validation.constraints.Size;

public record UpdateUserRequestDTO(
        String username,
        @Size(min = 8, message = "Password must be have 8chars at least") String password,
        String firstName,
        String lastName,
        String email,
        Role role
) {
}
