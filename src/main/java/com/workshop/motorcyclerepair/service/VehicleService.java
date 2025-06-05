package com.workshop.motorcyclerepair.service;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.dto.vehicle.FilterVehicleDTO;
import com.workshop.motorcyclerepair.dto.vehicle.NewVehicleRequestDTO;
import com.workshop.motorcyclerepair.dto.vehicle.VehicleDTO;
import com.workshop.motorcyclerepair.exception.EntityAlreadyExistsException;
import com.workshop.motorcyclerepair.mapper.VehicleMapper;
import com.workshop.motorcyclerepair.model.Customer;
import com.workshop.motorcyclerepair.model.Vehicle;
import com.workshop.motorcyclerepair.repository.VehicleRepository;
import com.workshop.motorcyclerepair.repository.specification.CustomerSpecification;
import com.workshop.motorcyclerepair.repository.specification.VehicleSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.util.List;
import java.util.Objects;

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

    public List<VehicleDTO> getVehicleList(FilterVehicleDTO filter) {
        return vehicleRepository.findAll(createVehicleSpecification(filter))
                .stream()
                .map(vehicleMapper::toDTO)
                .toList();
    }
    public VehicleDTO insertNewVehicle(NewVehicleRequestDTO newVehicleRequestDTO) {
        if(vehicleRepository.findVehicleByNameplate(newVehicleRequestDTO.nameplate()).isPresent()) {
            throw new EntityAlreadyExistsException("This nameplate already exist");
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

    public List<String> getBrandsList() {
        return vehicleRepository.findAllDistinctBrands();
    }

    public List<String > getModelsFilteredByBrand(String brand) {
        return vehicleRepository.findDistinctModels(brand);
    }


    private Specification<Vehicle> createVehicleSpecification(FilterVehicleDTO filter) {
        Specification<Vehicle> spec = Specification.where(null);

        if(Objects.nonNull(filter.customerId())) {
            spec = spec.and(VehicleSpecification.hasCustomerId(filter.customerId()));
        }

        if(!StringUtil.isNullOrEmpty(filter.nameplate())) {
            spec = spec.and(VehicleSpecification.hasNameplate(filter.nameplate()));
        }

        if(!StringUtil.isNullOrEmpty(filter.brand())) {
            spec = spec.and(VehicleSpecification.hasBrand(filter.brand()));
        }

        if(!StringUtil.isNullOrEmpty(filter.model())) {
            spec = spec.and(VehicleSpecification.hadModel(filter.model()));
        }

        return spec;
    }

}
