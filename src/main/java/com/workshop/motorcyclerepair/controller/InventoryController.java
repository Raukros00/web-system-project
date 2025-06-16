package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.spare.FilterSparePartDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartDTO;
import com.workshop.motorcyclerepair.service.InventoryService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/inventory")
@AllArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/")
    @PreAuthorize("@roleChecker.hasAnyRole({'MECHANIC', 'WAREHOUS_WORKER'})")
    public ResponseEntity<List<SparePartDTO>> getSparePartList(@ModelAttribute FilterSparePartDTO filter) {
        return ResponseEntity.ok().body(inventoryService.getSparePartList(filter));
    }

}
