package com.workshop.motorcyclerepair.dto.vehicle;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class VehiclePracticeDTO extends VehicleDTO{

    @Override
    @JsonIgnore
    public CustomerDTO getCustomer() {
        return super.getCustomer();
    }

}
