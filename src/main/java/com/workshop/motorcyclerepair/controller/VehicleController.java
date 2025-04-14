package com.workshop.motorcyclerepair.controller;


import com.workshop.motorcyclerepair.dto.vehicle.NewVehicleRequestDTO;
import com.workshop.motorcyclerepair.dto.vehicle.VehicleDTO;
import com.workshop.motorcyclerepair.service.VehicleService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/vehicle")
@AllArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/{nameplate}")
    public ResponseEntity<VehicleDTO> getVehicleByNamePlate(@PathVariable String nameplate) {
        return ResponseEntity.ok().body(vehicleService.getVehicleByNamePlate(nameplate));
    }

    @PostMapping("/")
    public ResponseEntity<VehicleDTO> newVehicle(@RequestBody @Valid NewVehicleRequestDTO newVehicle) {
        return ResponseEntity.ok().body(vehicleService.insertNewVehicle(newVehicle));
    }


}
