package com.workshop.motorcyclerepair.service;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.dto.practice.NewPracticeRequestDTO;
import com.workshop.motorcyclerepair.dto.practice.PracticeDTO;
import com.workshop.motorcyclerepair.dto.practice.UpdatePracticeRequestDTO;
import com.workshop.motorcyclerepair.exception.NotFoundException;
import com.workshop.motorcyclerepair.mapper.PracticeMapper;
import com.workshop.motorcyclerepair.model.Practice;
import com.workshop.motorcyclerepair.model.Vehicle;
import com.workshop.motorcyclerepair.repository.PracticeRepository;
import com.workshop.motorcyclerepair.repository.VehicleRepository;
import com.workshop.motorcyclerepair.utils.Status;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.client.ResourceAccessException;

import java.util.List;

@Service
@AllArgsConstructor
public class PracticeService {

    private final PracticeRepository practiceRepository;
    private final VehicleRepository vehicleRepository;

    private final PracticeMapper practiceMapper = PracticeMapper.INSTANCE;

    public PracticeDTO addNewPractice(NewPracticeRequestDTO newPracticeRequestDTO)  {

        Vehicle vehicle = vehicleRepository.findVehicleByNameplate(newPracticeRequestDTO.nameplate())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));


        Practice newPractice = practiceRepository.save(Practice.builder()
                .status(Status.ACCEPTED)
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

    public List<PracticeDTO> getIncompletePracticesList() {
        return practiceRepository.findByStatusIn(List.of(Status.ACCEPTED, Status.IN_PROGRESS))
                .stream()
                .map(practiceMapper::toDTO)
                .toList();
    }

    public List<PracticeDTO> getCompletedPracticesList() {
        return practiceRepository.findByStatusIn(List.of(Status.COMPLETED))
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
    public PracticeDTO updatePracticeById(Long practiceId, UpdatePracticeRequestDTO practiceRequestDTO) throws BadRequestException {
        Practice practice = practiceRepository.findById(practiceId)
                .orElseThrow(() -> new NotFoundException("Practice not found"));


        if(practiceRequestDTO.totalHours() < 0 || practiceRequestDTO.totalHours() < practice.getTotalHours()) {
            throw new BadRequestException("Invalid hours exception");
        }

        practice.setStatus(practiceRequestDTO.newStatus());
        practice.setTotalHours(practiceRequestDTO.totalHours());
        practice.setWorkDescription(practiceRequestDTO.workDescription());

        return practiceMapper.toDTO(practiceRepository.save(practice));
    }

}
