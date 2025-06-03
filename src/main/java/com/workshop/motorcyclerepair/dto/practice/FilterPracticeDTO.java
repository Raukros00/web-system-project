package com.workshop.motorcyclerepair.dto.practice;

import java.util.List;

public record FilterPracticeDTO(
        List<String> status,
        String nameOrSurname,
        String brand,
        String model,
        String nameplate
        ) { }
