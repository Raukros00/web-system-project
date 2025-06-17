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
import org.springframework.security.core.authority.SimpleGrantedAuthority;
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
    public void updatePracticeById(Long practiceId, UpdatePracticeRequestDTO practiceRequestDTO) {
        AtomicReference<BigDecimal> totalPrice = new AtomicReference<>(BigDecimal.ZERO);

        boolean isCashier = SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals(Role.CASHIER.asAuthority()));

        Practice practice = practiceRepository.findById(practiceId)
                .orElseThrow(() -> new NotFoundException("Practice not found"));

        if(!isCashier) {
            if(practiceRequestDTO.totalHours() < 0 || practiceRequestDTO.totalHours() < practice.getTotalHours()) {
                throw new BadRequestException("Invalid hours exception");
            }

            if(practiceRequestDTO.newStatus().equals(Status.COMPLETED)){
                throw new AuthorizationDeniedException("Access denied");
            }
        }

        List<UsedSparePart> usedSparePartList = new ArrayList<>();

        if(Objects.nonNull(practiceRequestDTO.usedSparePartList()) && !practiceRequestDTO.usedSparePartList().isEmpty()) {

            List<SparePartToUpdateDTO> sparePartToUpdate = practiceRequestDTO.usedSparePartList();

            inventoryService.updateSparePartQuantities(sparePartToUpdate).forEach(sparePart -> {

                SparePartToUpdateDTO matchedSparePart = sparePartToUpdate.stream()
                        .filter(sp -> sp.id().equals(sparePart.getId()))
                        .findFirst()
                        .orElseThrow(() -> new NotFoundException("Spare part not found"));

                usedSparePartList.add(UsedSparePart.builder()
                        .sparePart(sparePartMapper.toEntity(sparePart))
                        .priceAtUse(sparePart.getPrice())
                        .practice(practice)
                        .quantity(matchedSparePart.quantity())
                        .build());


                totalPrice.updateAndGet(current -> current.add(BigDecimal.valueOf(sparePart.getPrice().doubleValue() * matchedSparePart.quantity())));
            });
        }

        if(!isCashier) {
            BigDecimal manpowerCost = practice.getManpowerCost().multiply(BigDecimal.valueOf(practiceRequestDTO.totalHours()));
            practice.getUsedSparePartList().clear();
            practice.setTotalHours(practiceRequestDTO.totalHours());
            practice.setWorkDescription(practiceRequestDTO.workDescription());
            practice.getUsedSparePartList().addAll(usedSparePartList);
            practice.setTotalPrice(totalPrice.get().add(manpowerCost));
        }

        practice.setStatus(practiceRequestDTO.newStatus());
        practiceRepository.save(practice);
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
