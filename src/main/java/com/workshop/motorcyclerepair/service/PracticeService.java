package com.workshop.motorcyclerepair.service;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.dto.practice.FilterPracticeDTO;
import com.workshop.motorcyclerepair.dto.practice.NewPracticeRequestDTO;
import com.workshop.motorcyclerepair.dto.practice.PracticeDTO;
import com.workshop.motorcyclerepair.dto.practice.UpdatePracticeRequestDTO;
import com.workshop.motorcyclerepair.dto.spare.SparePartToUpdateDTO;
import com.workshop.motorcyclerepair.exception.BadRequestException;
import com.workshop.motorcyclerepair.exception.NotFoundException;
import com.workshop.motorcyclerepair.mapper.PracticeMapper;
import com.workshop.motorcyclerepair.mapper.SparePartMapper;
import com.workshop.motorcyclerepair.model.Practice;
import com.workshop.motorcyclerepair.model.UsedSparePart;
import com.workshop.motorcyclerepair.model.Vehicle;
import com.workshop.motorcyclerepair.repository.PracticeRepository;
import com.workshop.motorcyclerepair.repository.VehicleRepository;
import com.workshop.motorcyclerepair.repository.specification.PracticeSpecification;
import com.workshop.motorcyclerepair.utils.Role;
import com.workshop.motorcyclerepair.utils.Status;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;

@Service
@AllArgsConstructor
public class PracticeService {

    private final PracticeRepository practiceRepository;
    private final VehicleRepository vehicleRepository;

    private final InventoryService inventoryService;
    private final SettingService settingService;

    private final PracticeMapper practiceMapper;
    private final SparePartMapper sparePartMapper = SparePartMapper.INSTANCE;

    public PracticeDTO addNewPractice(NewPracticeRequestDTO newPracticeRequestDTO)  {

        Vehicle vehicle = vehicleRepository.findVehicleByNameplate(newPracticeRequestDTO.nameplate())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        BigDecimal manpowerCost = new BigDecimal(settingService.getSetting("manpowerCost"));

        Practice newPractice = practiceRepository.save(Practice.builder()
                .status(Status.ACCEPTED)
                .problemDescription(newPracticeRequestDTO.problemDescription())
                .totalHours(0.0)
                .totalPrice(BigDecimal.ZERO)
                .manpowerCost(manpowerCost)
                .vehicle(vehicle)
                .customer(vehicle.getCustomer())
                .build()
        );

        return practiceMapper.toDTO(newPractice);
    }

    public PracticeDTO getPracticeById(Long practiceId) {
        Practice practice = practiceRepository.findById(practiceId)
                .orElseThrow(() -> new NotFoundException("Practice not found"));

        return practiceMapper.toDTO(practice);
    }

    public List<PracticeDTO> getPracticesList(FilterPracticeDTO filter) {
        return practiceRepository.findAll(createPracticeSpecification(filter))
                .stream()
                .map(practiceMapper::toDTO)
                .toList();
    }

    public PracticeDTO searchPractice(Long practiceId, String nameplate) {
        Practice practice = practiceRepository.findByIdAndAndNameplate(practiceId, nameplate)
                .orElseThrow(() -> new NotFoundException("Practice not found"));

        return practiceMapper.toDTO(practice);
    }


    @Transactional
    public void updatePracticeById(Long practiceId, UpdatePracticeRequestDTO dto) {
        Practice practice = practiceRepository.findById(practiceId)
                .orElseThrow(() -> new NotFoundException("Practice not found"));

        boolean isCashier = isCurrentUserCashier();

        validateUpdateRequest(dto, practice, isCashier);

        if (shouldUpdateSpareParts(dto, practice)) {
            updateUsedSpareParts(practice, dto);
        }

        if (!isCashier) {
            updatePracticeDetails(practice, dto);
        }

        practice.setStatus(dto.newStatus());
        practiceRepository.save(practice);
    }

    private boolean isCurrentUserCashier() {
        return SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals(Role.CASHIER.asAuthority()));
    }

    private void validateUpdateRequest(UpdatePracticeRequestDTO dto, Practice practice, boolean isCashier) {
        if (!isCashier) {
            if (dto.totalHours() < 0 || dto.totalHours() < practice.getTotalHours()) {
                throw new BadRequestException("Invalid hours exception");
            }
            if (dto.newStatus().equals(Status.COMPLETED)) {
                throw new AuthorizationDeniedException("Access denied");
            }
        }
    }

    private boolean shouldUpdateSpareParts(UpdatePracticeRequestDTO dto, Practice practice) {
        if (dto.usedSparePartList() == null || dto.usedSparePartList().isEmpty()) return false;

        List<Long> dtoIds = dto.usedSparePartList().stream().map(SparePartToUpdateDTO::id).toList();
        List<Long> entityIds = practice.getUsedSparePartList().stream()
                .map(pp -> pp.getSparePart().getId())
                .toList();

        return !dtoIds.equals(entityIds);
    }

    private void updateUsedSpareParts(Practice practice, UpdatePracticeRequestDTO dto) {
        List<SparePartToUpdateDTO> sparePartDTOs = dto.usedSparePartList();
        List<UsedSparePart> updatedParts = new ArrayList<>();
        AtomicReference<BigDecimal> totalPrice = new AtomicReference<>(BigDecimal.ZERO);

        inventoryService.updateSparePartQuantities(sparePartDTOs).forEach(sparePart -> {
            SparePartToUpdateDTO matchedDto = sparePartDTOs.stream()
                    .filter(sp -> sp.id().equals(sparePart.getId()))
                    .findFirst()
                    .orElseThrow(() -> new NotFoundException("Spare part not found"));

            UsedSparePart usedPart = UsedSparePart.builder()
                    .sparePart(sparePartMapper.toEntity(sparePart))
                    .priceAtUse(sparePart.getPrice())
                    .practice(practice)
                    .quantity(matchedDto.quantity())
                    .build();

            updatedParts.add(usedPart);

             totalPrice.updateAndGet(current -> current.add(sparePart.getPrice().multiply(BigDecimal.valueOf(matchedDto.quantity()))));
        });

        practice.getUsedSparePartList().clear();
        practice.getUsedSparePartList().addAll(updatedParts);
        practice.setTotalPrice(totalPrice.get().add(
                practice.getManpowerCost().multiply(BigDecimal.valueOf(dto.totalHours()))
        ));
    }

    private void updatePracticeDetails(Practice practice, UpdatePracticeRequestDTO dto) {
        practice.setTotalHours(dto.totalHours());
        practice.setWorkDescription(dto.workDescription());
    }

    private Specification<Practice> createPracticeSpecification(FilterPracticeDTO filter) {
        Specification<Practice> spec = Specification.where(null);

        if(!Objects.isNull(filter.status()) && !filter.status().isEmpty()) {
            spec = spec.and(PracticeSpecification.hasStatus(filter.status()));
        }

        if(!StringUtil.isNullOrEmpty(filter.nameOrSurname())) {
            spec = spec.and(PracticeSpecification.hasNameOrSurname(filter.nameOrSurname()));
        }

        if(!StringUtil.isNullOrEmpty(filter.brand())) {
            spec = spec.and(PracticeSpecification.hasBrand(filter.brand()));
        }

        if(!StringUtil.isNullOrEmpty(filter.model())) {
            spec = spec.and(PracticeSpecification.hasModel(filter.model()));
        }

        if(!StringUtil.isNullOrEmpty(filter.nameplate())) {
            spec = spec.and(PracticeSpecification.hasNameplate(filter.nameplate()));
        }

        return spec;
    }

}
