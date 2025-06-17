package com.workshop.motorcyclerepair.mapper;

import com.workshop.motorcyclerepair.dto.spare.UsedSparePartDTO;
import com.workshop.motorcyclerepair.model.UsedSparePart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UsedSparePartMapper {

    @Mapping(source = "sparePart.id", target = "id")
    @Mapping(source = "sparePart.partName", target = "sparePartName")
    @Mapping(source = "priceAtUse", target = "price")
    UsedSparePartDTO toDto(UsedSparePart usedSparePart);

    @Mapping(target = "sparePart", ignore = true)
    @Mapping(source = "price", target = "priceAtUse")
    UsedSparePart toEntity(UsedSparePartDTO sparePartDTO);

}
