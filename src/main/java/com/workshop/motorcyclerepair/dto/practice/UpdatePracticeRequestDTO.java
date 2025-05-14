package com.workshop.motorcyclerepair.dto.practice;

import com.workshop.motorcyclerepair.utils.Status;

public record UpdatePracticeRequestDTO(
        Status newStatus,
        Double totalHours,
        String workDescription
) {
}
