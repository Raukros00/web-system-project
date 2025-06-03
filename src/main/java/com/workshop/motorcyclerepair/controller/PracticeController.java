package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.practice.FilterPracticeDTO;
import com.workshop.motorcyclerepair.dto.practice.NewPracticeRequestDTO;
import com.workshop.motorcyclerepair.dto.practice.PracticeDTO;
import com.workshop.motorcyclerepair.dto.practice.UpdatePracticeRequestDTO;
import com.workshop.motorcyclerepair.service.PracticeService;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@AllArgsConstructor
@RequestMapping("/practice")
public class PracticeController {

    private final PracticeService practiceService;

    @PreAuthorize("@roleChecker.hasRole({'ACCEPTANCE_AGENT'})")
    @PostMapping("/")
    public ResponseEntity<PracticeDTO> addNewPractice(@RequestBody NewPracticeRequestDTO newPracticeRequestDTO) {
            return ResponseEntity.ok().body(practiceService.addNewPractice(newPracticeRequestDTO));
    }

    @PreAuthorize("@roleChecker.hasAnyRole({'MECHANIC', 'ACCEPTANCE_AGENT'})")
    @GetMapping("/")
    public ResponseEntity<List<PracticeDTO>> getPracticesList(@ModelAttribute FilterPracticeDTO filter) {
        return ResponseEntity.ok().body(practiceService.getPracticesList(filter));
    }

    @PreAuthorize("@roleChecker.hasRole({'MECHANIC'})")
    @GetMapping("/{id}")
    public ResponseEntity<PracticeDTO> getPracticeById(@PathVariable Long id) {
        return ResponseEntity.ok().body(practiceService.getPracticeById(id));
    }

    @PreAuthorize("@roleChecker.hasRole({'MECHANIC'})")
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
