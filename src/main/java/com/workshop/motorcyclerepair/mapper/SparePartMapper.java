package com.workshop.motorcyclerepair.mapper;

import com.workshop.motorcyclerepair.dto.spare.SparePartDTO;
import com.workshop.motorcyclerepair.model.SparePart;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface SparePartMapper {

    SparePartMapper INSTANCE = Mappers.getMapper(SparePartMapper.class);

    SparePartDTO toDto(SparePart sparePart);

    SparePart toEntity(SparePartDTO sparePartDTO);

}
