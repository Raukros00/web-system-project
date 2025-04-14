package com.workshop.motorcyclerepair.dto.customer;

import lombok.Data;
import java.util.Date;

@Data
public class CustomerDTO {

    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String email;
    private Date birthDate;

}
