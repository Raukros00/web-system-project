package com.workshop.motorcyclerepair.dto.vehicle;

import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;

public record FilterVehicleDTO(
         String nameplate,
         String brand,
         String model
) {
}
