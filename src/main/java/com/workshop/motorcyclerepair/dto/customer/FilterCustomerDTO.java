package com.workshop.motorcyclerepair.dto.customer;

import java.util.Date;

public record FilterCustomerDTO(
        String callsign,
        String email,
        String phoneNumber,
        Date birthdate
) { }
