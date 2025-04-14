package com.workshop.motorcyclerepair.service;

import com.workshop.motorcyclerepair.dto.vehicle.NewVehicleRequestDTO;
import com.workshop.motorcyclerepair.dto.vehicle.VehicleDTO;
import com.workshop.motorcyclerepair.mapper.VehicleMapper;
import com.workshop.motorcyclerepair.model.Customer;
import com.workshop.motorcyclerepair.model.Vehicle;
import com.workshop.motorcyclerepair.repository.VehicleRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper = VehicleMapper.INSTANCE;

    public VehicleDTO getVehicleByNamePlate(String namePlate) {
        Vehicle vehicle = vehicleRepository.findVehicleByNameplate(namePlate)
                .orElseThrow(() -> new RuntimeException("No vehicle fount with this namePlate"));

        return vehicleMapper.toDTO(vehicle);
    }

    public VehicleDTO insertNewVehicle(NewVehicleRequestDTO newVehicleRequestDTO) {
        if(vehicleRepository.findVehicleByNameplate(newVehicleRequestDTO.nameplate()).isPresent()) {
            throw new RuntimeException("This nameplate already exist");
        }

        Customer customer = Customer.builder().id(newVehicleRequestDTO.customerId()).build();

        Vehicle newVehicle = vehicleRepository.save(Vehicle.builder()
                        .nameplate(newVehicleRequestDTO.nameplate())
                        .brand(newVehicleRequestDTO.brand())
                        .model(newVehicleRequestDTO.model())
                        .customer(customer)
                .build());

        return vehicleMapper.toDTO(newVehicle);
    }

}
