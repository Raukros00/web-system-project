package com.workshop.motorcyclerepair.dto.spare;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record NewSparePartRequestDTO(
        @NotNull(message = "PartName is require") String partName,
        @NotNull(message = "Quantity is required") @Min(value = 1, message = "The quantity must be at least one") int quantity,
        @NotNull(message = "") @Min(value = 1, message = "The price must be at least one") BigDecimal price
) {
}
