package com.workshop.motorcyclerepair.mapper;

import com.workshop.motorcyclerepair.dto.practice.PracticeDTO;
import com.workshop.motorcyclerepair.model.Practice;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = UsedSparePartMapper.class)
public interface PracticeMapper {

    PracticeDTO toDTO(Practice practice);
    Practice toEntity(PracticeDTO practiceDTO);
}
