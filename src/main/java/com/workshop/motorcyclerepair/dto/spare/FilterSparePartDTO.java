package com.workshop.motorcyclerepair.dto.spare;

public record FilterSparePartDTO(
        boolean isAvailable,
        Long id,
        String partName,
        Integer quantity
) {
}
