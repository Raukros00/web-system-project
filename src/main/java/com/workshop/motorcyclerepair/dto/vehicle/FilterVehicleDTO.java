package com.workshop.motorcyclerepair.dto.vehicle;

import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;

public record FilterVehicleDTO(
         Long customerId,
         String nameplate,
         String brand,
         String model
) {
}
