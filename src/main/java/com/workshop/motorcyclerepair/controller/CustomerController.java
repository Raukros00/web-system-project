package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import com.workshop.motorcyclerepair.dto.customer.NewCustomerRequestDTO;
import com.workshop.motorcyclerepair.service.CustomerService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/customer")
@AllArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long customerId) {
        return ResponseEntity.ok().body(customerService.getCustomerById(customerId));
    }

    @PostMapping("/")
    public ResponseEntity<CustomerDTO> newCustomer(@RequestBody NewCustomerRequestDTO newCustomerRequestDTO) {
        return ResponseEntity.ok().body(customerService.addNewCustomer(newCustomerRequestDTO));
    }

}
