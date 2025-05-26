package com.workshop.motorcyclerepair.repository;

import com.workshop.motorcyclerepair.model.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    Optional<Vehicle> findVehicleByNameplate(String nameplate);

    @Query("SELECT DISTINCT v.brand FROM Vehicle v")
    List<String> findAllDistinctBrands();


    @Query("""
        SELECT DISTINCT v.model
        FROM Vehicle v
        WHERE (:brand IS NULL OR v.brand = :brand)
        """)
    List<String> findDistinctModels(@Param("brand") String brand);



}
