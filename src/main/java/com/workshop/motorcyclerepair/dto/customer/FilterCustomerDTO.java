package com.workshop.motorcyclerepair.dto.customer;

import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

public record FilterCustomerDTO(
        String nameOrSurname,
        String email,
        String phoneNumber,
        LocalDate birthDate
) { }
