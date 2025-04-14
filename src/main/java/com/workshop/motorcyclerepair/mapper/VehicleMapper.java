package com.workshop.motorcyclerepair.mapper;

import com.workshop.motorcyclerepair.dto.vehicle.VehicleDTO;
import com.workshop.motorcyclerepair.model.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface VehicleMapper {
    VehicleMapper INSTANCE = Mappers.getMapper(VehicleMapper.class);

    VehicleDTO toDTO(Vehicle vehicle);
    Vehicle toEntity(VehicleDTO vehicleDTO);
}
