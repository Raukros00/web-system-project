package com.workshop.motorcyclerepair.dto.customer;

import java.time.LocalDate;

public record FilterCustomerDTO(
        String nameOrSurname,
        String email,
        String phoneNumber,
        LocalDate birthDate
) { }
