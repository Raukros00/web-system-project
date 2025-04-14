package com.workshop.motorcyclerepair.dto.vehicle;

import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import lombok.Data;

@Data
public class VehicleDTO {

    private String nameplate;
    private String brand;
    private String model;
    private CustomerDTO customer;

}
