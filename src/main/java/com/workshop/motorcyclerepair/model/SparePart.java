package com.workshop.motorcyclerepair.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "spare_part")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "part_name")
    private String partName;

    @Column(name = "quantity")
    private int quantity;

    @Column(name = "price")
    private BigDecimal price;


}
