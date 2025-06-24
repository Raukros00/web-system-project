package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.spare.FilterSparePartDTO;
import com.workshop.motorcyclerepair.dto.spare.NewSparePartRequestDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartToUpdateDTO;
import com.workshop.motorcyclerepair.service.InventoryService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@AllArgsConstructor
@Tag(name = "Inventory", description = "Handles spare parts inventory operations, including listing, adding, and updating parts.")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/")
    @PreAuthorize("@roleChecker.hasAnyRole({'MECHANIC', 'WAREHOUSE_WORKER'})")
    public ResponseEntity<List<SparePartDTO>> getSparePartList(@ModelAttribute FilterSparePartDTO filter) {
         return ResponseEntity.ok().body(inventoryService.getSparePartList(filter));
    }

    @PostMapping("/")
    @PreAuthorize("@roleChecker.hasRole({'WAREHOUSE_WORKER'})")
    public ResponseEntity<SparePartDTO> newSparePart(@RequestBody @Valid NewSparePartRequestDTO newSparePartRequestDTO) {
        return ResponseEntity.ok().body(inventoryService.newSparePart(newSparePartRequestDTO));
    }

    @PutMapping("/")
    @PreAuthorize("@roleChecker.hasRole({'WAREHOUSE_WORKER'})")
    public ResponseEntity<SparePartDTO> updateSparePart(@RequestBody @Valid SparePartToUpdateDTO sparePartToUpdateDTO) {
        return ResponseEntity.ok().body(inventoryService.updateSparePart(sparePartToUpdateDTO));
    }

}
