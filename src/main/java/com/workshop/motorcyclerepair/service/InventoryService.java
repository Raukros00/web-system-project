package com.workshop.motorcyclerepair.service;


import com.workshop.motorcyclerepair.dto.spare.FilterSparePartDTO;
import com.workshop.motorcyclerepair.dto.spare.NewSparePartRequestDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartToUpdateDTO;
import com.workshop.motorcyclerepair.exception.BadRequestException;
import com.workshop.motorcyclerepair.exception.EntityAlreadyExistsException;
import com.workshop.motorcyclerepair.exception.NotFoundException;
import com.workshop.motorcyclerepair.mapper.SparePartMapper;
import com.workshop.motorcyclerepair.model.Practice;
import com.workshop.motorcyclerepair.model.SparePart;
import com.workshop.motorcyclerepair.model.UsedSparePart;
import com.workshop.motorcyclerepair.repository.SparePartRepository;
import com.workshop.motorcyclerepair.repository.specification.SparePartSpecification;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class InventoryService {

    private final SparePartRepository sparePartRepository;
    private final SparePartMapper spareMapper = SparePartMapper.INSTANCE;

    public SparePartDTO findById(Long id) {
        SparePart sparePart = sparePartRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("SparePart not found"));

        return spareMapper.toDto(sparePart);
    }

    public List<SparePartDTO> getSparePartList(FilterSparePartDTO filter) {
        return sparePartRepository.findAll(createSparePartSpecification(filter))
                .stream()
                .map(spareMapper::toDto)
                .toList();
    }

    public SparePartDTO newSparePart(NewSparePartRequestDTO newSparePartRequestDTO) {
        if(sparePartRepository.findByPartName(newSparePartRequestDTO.partName()).isPresent()) {
            throw new EntityAlreadyExistsException("This spare part already exists!");
        }

        SparePart newSparePart = sparePartRepository.save(SparePart.builder()
                .partName(newSparePartRequestDTO.partName())
                .price(newSparePartRequestDTO.price())
                .quantity(newSparePartRequestDTO.quantity())
                .build());

        return spareMapper.toDto(newSparePart);
    }

    public List<UsedSparePart> syncSparePartsWithInventory(List<UsedSparePart> oldParts, List<SparePartToUpdateDTO> updatedDTOs, Practice practice) {
        Map<Long, Integer> newQuantities = updatedDTOs.stream()
                .collect(Collectors.toMap(SparePartToUpdateDTO::id, SparePartToUpdateDTO::quantity));

        Map<Long, UsedSparePart> oldPartsMap = oldParts.stream()
                .collect(Collectors.toMap(
                        usp -> usp.getSparePart().getId(),
                        usp -> usp
                ));

        List<UsedSparePart> updatedParts = new ArrayList<>();
        AtomicReference<BigDecimal> totalPrice = new AtomicReference<>(BigDecimal.ZERO);

        newQuantities.forEach((id, newQty) -> {
            int oldQty = oldPartsMap.getOrDefault(id, null) != null ? oldPartsMap.get(id).getQuantity() : 0;
            int delta = newQty - oldQty;

            if (delta != 0) {
                updateSparePartQuantityByDelta(id, delta);
            }

            SparePart sparePart = spareMapper.toEntity(findById(id));

            updatedParts.add(
                    UsedSparePart.builder()
                            .sparePart(sparePart)
                            .practice(practice)
                            .priceAtUse(sparePart.getPrice())
                            .quantity(newQty)
                            .build()
            );

            totalPrice.updateAndGet(current -> current.add(
                    sparePart.getPrice().multiply(BigDecimal.valueOf(newQty))
            ));
        });

        oldPartsMap.forEach((id, oldUsedPart) -> {
            if (!newQuantities.containsKey(id)) {
                updateSparePartQuantityByDelta(id, oldUsedPart.getQuantity() * -1);
            }
        });

        return updatedParts;
    }

    public void updateSparePartQuantityByDelta(Long id, int delta) {
        SparePart part = sparePartRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Spare part not found"));

        int updatedQty = part.getQuantity() - delta;

        if (updatedQty < 0) {
            throw new BadRequestException("Insufficient stock for part");
        }

        part.setQuantity(updatedQty);
        sparePartRepository.save(part);
    }

    public SparePartDTO updateSparePart(SparePartToUpdateDTO sparePartToUpdateDTO) {
        SparePart sparePart = sparePartRepository.findById(sparePartToUpdateDTO.id())
                .orElseThrow(() -> new NotFoundException("SparePart not found"));

        sparePart.setQuantity(sparePartToUpdateDTO.quantity());
        sparePart.setPrice(sparePartToUpdateDTO.price());

        return spareMapper.toDto(sparePartRepository.save(sparePart));
    }

    private static Specification<SparePart> createSparePartSpecification(FilterSparePartDTO filter) {
        Specification<SparePart> spec = Specification.where(null);

        if(filter.isAvailable()) {
            spec = spec.and(SparePartSpecification.isAvailable());
        }

        if (Objects.nonNull(filter.id())) {
            spec = spec.and(SparePartSpecification.hasId(filter.id()));
        }

        if(Objects.nonNull(filter.partName())) {
            spec = spec.and(SparePartSpecification.hasPartName(filter.partName()));
        }

        if(Objects.nonNull(filter.quantity())) {
            spec = spec.and(SparePartSpecification.hasQuantity(filter.quantity()));
        }

        return spec;
    }



}
