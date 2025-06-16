package com.workshop.motorcyclerepair.dto.spare;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SparePartDTO {
    private Long id;
    private String partName;
    private int quantity;
    private BigDecimal price;
}
