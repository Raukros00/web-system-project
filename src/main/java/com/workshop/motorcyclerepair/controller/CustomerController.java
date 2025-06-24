package com.workshop.motorcyclerepair.controller;

import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import com.workshop.motorcyclerepair.dto.customer.FilterCustomerDTO;
import com.workshop.motorcyclerepair.dto.customer.NewCustomerRequestDTO;
import com.workshop.motorcyclerepair.service.CustomerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer")
@AllArgsConstructor
@Tag(name = "Customer", description = "Manages customer operations such as retrieving, filtering, and creating customers.")
public class CustomerController {

    private final CustomerService customerService;

    @GetMapping("/{customerId}")
    public ResponseEntity<CustomerDTO> getCustomerById(@PathVariable Long customerId) {
        return ResponseEntity.ok().body(customerService.getCustomerById(customerId));
    }

    @GetMapping("/")
    public ResponseEntity<List<CustomerDTO>> getCustomerList(@ModelAttribute FilterCustomerDTO filter) {
        return ResponseEntity.ok().body(customerService.getCustomerList(filter));
    }

    @PostMapping("/")
    public ResponseEntity<CustomerDTO> newCustomer(@RequestBody @Valid NewCustomerRequestDTO newCustomerRequestDTO) {
        return ResponseEntity.ok().body(customerService.addNewCustomer(newCustomerRequestDTO));
    }

}
