package com.workshop.motorcyclerepair.dto.customer;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record NewCustomerRequestDTO(
        @NotNull(message = "Firstname is required") String firstName,
        @NotNull(message = "Lastname is required") String lastName,
        @NotNull(message = "PhoneNumber is required") String phoneNumber,
        @NotNull(message = "Email is required") String email,
        @NotNull(message = "BirthDate is required") LocalDate birthDate

) {
}
