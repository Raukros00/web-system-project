package com.workshop.motorcyclerepair.dto.vehicle;

public record FilterVehicleDTO(
         Long customerId,
         String nameplate,
         String brand,
         String model
) {
}
