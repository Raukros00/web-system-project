package com.workshop.motorcyclerepair.dto.customer;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDate;
import java.util.Date;

@Data
public class CustomerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private LocalDate birthDate;

}
