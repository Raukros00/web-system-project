package com.workshop.motorcyclerepair.dto.vehicle;

import jakarta.validation.constraints.NotNull;

public record NewVehicleRequestDTO(
        @NotNull(message = "Nameplate is required") String nameplate,
        @NotNull(message = "Brand is required") String brand,
        @NotNull(message = "Model is required") String model,
        @NotNull(message = "CustomerID is required") Long customerId
) {
}
