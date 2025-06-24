package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.practice.FilterPracticeDTO;
import com.workshop.motorcyclerepair.dto.practice.NewPracticeRequestDTO;
import com.workshop.motorcyclerepair.dto.practice.PracticeDTO;
import com.workshop.motorcyclerepair.dto.practice.UpdatePracticeRequestDTO;
import com.workshop.motorcyclerepair.service.PracticeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/practice")
@Tag(name = "Practice", description = "Manages repair practices including creation, retrieval, filtering, and updates.")
public class PracticeController {

    private final PracticeService practiceService;

    @PreAuthorize("@roleChecker.hasRole({'ACCEPTANCE_AGENT'})")
    @PostMapping("/")
    public ResponseEntity<PracticeDTO> addNewPractice(@RequestBody @Valid NewPracticeRequestDTO newPracticeRequestDTO) {
            return ResponseEntity.ok().body(practiceService.addNewPractice(newPracticeRequestDTO));
    }

    @PreAuthorize("@roleChecker.hasAnyRole({'MECHANIC', 'ACCEPTANCE_AGENT', 'CASHIER'})")
    @GetMapping("/")
    public ResponseEntity<List<PracticeDTO>> getPracticesList(@ModelAttribute FilterPracticeDTO filter) {
        return ResponseEntity.ok().body(practiceService.getPracticesList(filter));
    }

    @PreAuthorize("@roleChecker.hasAnyRole({'MECHANIC', 'CASHIER'})")
    @GetMapping("/{id}")
    public ResponseEntity<PracticeDTO> getPracticeById(@PathVariable Long id) {
        return ResponseEntity.ok().body(practiceService.getPracticeById(id));
    }

    @PreAuthorize("@roleChecker.hasAnyRole({'MECHANIC', 'CASHIER'})")
    @PatchMapping("/{id}")
    public ResponseEntity<Void> updatePracticeById(@PathVariable Long id, @RequestBody UpdatePracticeRequestDTO practice) throws BadRequestException {
        practiceService.updatePracticeById(id, practice);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<PracticeDTO> searchPractice(@RequestParam Long practiceId, @RequestParam String nameplate) {
        return ResponseEntity.ok().body(practiceService.searchPractice(practiceId, nameplate));
    }

}
