package com.workshop.motorcyclerepair.service;

import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import com.workshop.motorcyclerepair.dto.customer.NewCustomerRequestDTO;
import com.workshop.motorcyclerepair.mapper.CustomerMapper;
import com.workshop.motorcyclerepair.model.Customer;
import com.workshop.motorcyclerepair.repository.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper = CustomerMapper.INSTANCE;

    public CustomerDTO getCustomerById(Long customerId) {
        Customer customer =  customerRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Customer not found!"));
        return customerMapper.toDTO(customer);
    }

    public CustomerDTO addNewCustomer(NewCustomerRequestDTO newCustomerRequestDTO) {
        if (customerRepository.findByPhoneNumber(newCustomerRequestDTO.phoneNumber()).isPresent()) {
            throw new RuntimeException("This customer already exists!");
        }

        Customer newCustomer = customerRepository.save(Customer.builder()
                .firstName(newCustomerRequestDTO.firstName())
                .lastName(newCustomerRequestDTO.lastname())
                .birthDate(newCustomerRequestDTO.birthDate())
                .phoneNumber(newCustomerRequestDTO.phoneNumber())
                .email(newCustomerRequestDTO.email())
                .build()
        );

        return customerMapper.toDTO(newCustomer);
    }

}
