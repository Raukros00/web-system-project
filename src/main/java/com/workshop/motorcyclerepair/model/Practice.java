package com.workshop.motorcyclerepair.model;

import com.workshop.motorcyclerepair.utils.Status;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "practice")
@Data
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

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

}
