package com.workshop.motorcyclerepair.mapper;

import com.workshop.motorcyclerepair.dto.practice.PracticeDTO;
import com.workshop.motorcyclerepair.model.Practice;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface PracticeMapper {
    PracticeMapper INSTANCE = Mappers.getMapper(PracticeMapper.class);

    PracticeDTO toDTO(Practice practice);
    Practice toEntity(PracticeDTO practiceDTO);
}
