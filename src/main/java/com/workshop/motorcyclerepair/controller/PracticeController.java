package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.practice.NewPracticeRequestDTO;
import com.workshop.motorcyclerepair.dto.practice.PracticeDTO;
import com.workshop.motorcyclerepair.service.PracticeService;
import lombok.AllArgsConstructor;
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

    @PostMapping("/")
    public ResponseEntity<PracticeDTO> addNewPractice(@RequestBody NewPracticeRequestDTO newPracticeRequestDTO) {
            return ResponseEntity.ok().body(practiceService.addNewPractice(newPracticeRequestDTO));
    }
    @PreAuthorize("@roleChecker.hasRole({'MECHANIC'})")
    @GetMapping("/")
    public ResponseEntity<List<PracticeDTO>> getIncompletePracticesList() {
        return ResponseEntity.ok().body(practiceService.getIncompletePracticesList());
    }

    @PreAuthorize("@roleChecker.hasRole({'MECHANIC'})")
    @GetMapping("/{id}")
    public ResponseEntity<PracticeDTO> getPracticeById(@PathVariable Long id) {
        return ResponseEntity.ok().body(practiceService.getPracticeById(id));
    }

    @PreAuthorize("@roleChecker.hasRole({'MECHANIC'})")
    @GetMapping("/completed")
    public ResponseEntity<List<PracticeDTO>> getCompletedPracticesList() {
        return ResponseEntity.ok().body(practiceService.getCompletedPracticesList());
    }

    @GetMapping("/search")
    public ResponseEntity<PracticeDTO> searchPractice(@RequestParam Long practiceId ,@RequestParam String nameplate) {
        return ResponseEntity.ok().body(practiceService.searchPractice(practiceId, nameplate));
    }

}
