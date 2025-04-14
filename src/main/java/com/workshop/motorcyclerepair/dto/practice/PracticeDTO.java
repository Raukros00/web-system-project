package com.workshop.motorcyclerepair.dto.practice;
import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import com.workshop.motorcyclerepair.dto.vehicle.VehicleDTO;
import com.workshop.motorcyclerepair.utils.Status;
import lombok.Data;

@Data
public class PracticeDTO {
    private Long id;
    private Status status;
    private VehicleDTO vehicle;
    private CustomerDTO customer;
}
