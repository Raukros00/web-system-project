package com.workshop.motorcyclerepair.repository;

import com.workshop.motorcyclerepair.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findVehicleByNameplate(String nameplate);
}
