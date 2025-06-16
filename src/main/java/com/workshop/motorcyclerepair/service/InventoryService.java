package com.workshop.motorcyclerepair.service;


import com.workshop.motorcyclerepair.dto.spare.FilterSparePartDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartToUpdateDTO;
import com.workshop.motorcyclerepair.exception.BadRequestException;
import com.workshop.motorcyclerepair.exception.NotFoundException;
import com.workshop.motorcyclerepair.mapper.SparePartMapper;
import com.workshop.motorcyclerepair.model.SparePart;
import com.workshop.motorcyclerepair.repository.SparePartRepository;
import com.workshop.motorcyclerepair.repository.specification.SparePartSpecification;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class InventoryService {

    private final SparePartRepository sparePartRepository;
    private final SparePartMapper spareMapper = SparePartMapper.INSTANCE;

    public List<SparePartDTO> getSparePartList(FilterSparePartDTO filter) {
        return sparePartRepository.findAll(createSparePartSpecification(filter))
                .stream()
                .map(spareMapper::toDto)
                .toList();
    }

    @Transactional
    public List<SparePartDTO> updateSparePartQuantities(List<SparePartToUpdateDTO> sparePartDTOList) {
        List<SparePart> updatedParts = new ArrayList<>();
        List<SparePartDTO> usedSpareParts = new ArrayList<>();

        sparePartDTOList.forEach(sparePartDTO -> {
            SparePart sparePart = sparePartRepository.findById(sparePartDTO.id())
                    .orElseThrow(() -> new NotFoundException("SparePart not found"));

            if(sparePartDTO.quantity() > sparePart.getQuantity()) {
                throw new BadRequestException("Invalid quantity exception");
            }

            sparePart.setQuantity(sparePart.getQuantity() - sparePartDTO.quantity());
            updatedParts.add(sparePart);
            usedSpareParts.add(spareMapper.toDto(sparePart));
        });

        sparePartRepository.saveAll(updatedParts);
        return usedSpareParts;
    }

    private static Specification<SparePart> createSparePartSpecification(FilterSparePartDTO filter) {
        Specification<SparePart> spec = Specification.where(null);

        if(filter.isAvailable()) {
            spec = spec.and(SparePartSpecification.isAvailable());
        }

        return spec;
    }



}
