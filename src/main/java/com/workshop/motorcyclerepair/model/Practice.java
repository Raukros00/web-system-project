package com.workshop.motorcyclerepair.model;

import com.workshop.motorcyclerepair.utils.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "practice")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Practice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "problem_description")
    private String problemDescription;

    @Column(name = "work_description")
    private String workDescription;

    @Column(name = "total_hours")
    @NotNull
    private Double totalHours;

    @Column(name = "total_price")
    @NotNull
    private BigDecimal totalPrice;

    @Column(name = "manpower_cost")
    @NotNull
    private BigDecimal manpowerCost;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @OneToMany(mappedBy = "practice", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<UsedSparePart> usedSparePartList = new ArrayList<>();

}
