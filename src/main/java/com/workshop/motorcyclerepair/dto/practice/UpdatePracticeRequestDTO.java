package com.workshop.motorcyclerepair.dto.practice;

import com.workshop.motorcyclerepair.dto.spare.SparePartToUpdateDTO;
import com.workshop.motorcyclerepair.utils.Status;

import java.util.List;

public record UpdatePracticeRequestDTO(
        Status newStatus,
        Double totalHours,
        String workDescription,
        List<SparePartToUpdateDTO> usedSparePartList
) {
}
