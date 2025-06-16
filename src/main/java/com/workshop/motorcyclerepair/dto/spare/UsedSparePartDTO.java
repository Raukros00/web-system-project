package com.workshop.motorcyclerepair.dto.spare;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UsedSparePartDTO {
    private Long id;
    private String sparePartName;
    private int quantity;
    private BigDecimal price;
}
