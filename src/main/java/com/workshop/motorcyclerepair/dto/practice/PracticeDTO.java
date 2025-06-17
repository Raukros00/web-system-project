package com.workshop.motorcyclerepair.dto.practice;

import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import com.workshop.motorcyclerepair.dto.spare.UsedSparePartDTO;
import com.workshop.motorcyclerepair.dto.vehicle.VehiclePracticeDTO;
import com.workshop.motorcyclerepair.utils.Status;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PracticeDTO {
    private Long id;
    private Status status;
    private String problemDescription;
    private String workDescription;
    private Double totalHours;
    private BigDecimal totalPrice;
    private BigDecimal manpowerCost;
    private VehiclePracticeDTO vehicle;
    private CustomerDTO customer;
    private List<UsedSparePartDTO> usedSparePartList;
}
