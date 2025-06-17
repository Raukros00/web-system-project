package com.workshop.motorcyclerepair.dto.customer;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CustomerDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private LocalDate birthDate;

}
