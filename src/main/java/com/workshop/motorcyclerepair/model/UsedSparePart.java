package com.workshop.motorcyclerepair.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "used_spare_parts")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsedSparePart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "practice_id", nullable = false)
    private Practice practice;

    @ManyToOne(optional = false)
    @JoinColumn(name = "spare_part_id", nullable = false)
    @ToString.Exclude
    private SparePart sparePart;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "price_at_use", nullable = false, precision = 10, scale = 2)
    private BigDecimal priceAtUse;


}
