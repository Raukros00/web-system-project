package com.workshop.motorcyclerepair.service;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import com.workshop.motorcyclerepair.dto.customer.NewCustomerRequestDTO;
import com.workshop.motorcyclerepair.exception.NotFoundException;
import com.workshop.motorcyclerepair.mapper.CustomerMapper;
import com.workshop.motorcyclerepair.model.Customer;
import com.workshop.motorcyclerepair.repository.CustomerRepository;
import com.workshop.motorcyclerepair.repository.specification.CustomerSpecification;
import lombok.AllArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@AllArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper = CustomerMapper.INSTANCE;

    public CustomerDTO getCustomerById(Long customerId) {
        Customer customer =  customerRepository.findById(customerId)
                .orElseThrow(() -> new NotFoundException("Customer not found!"));
        return customerMapper.toDTO(customer);
    }

    public List<CustomerDTO> getCustomerList(CustomerDTO filter) {
        return customerRepository.findAll(createCustomerSpecification(filter))
                .stream()
                .map(customerMapper::toDTO)
                .toList();
    }

    private static Specification<Customer> createCustomerSpecification(CustomerDTO filter) {
        Specification<Customer> spec = Specification.where(null);

        if(!StringUtil.isNullOrEmpty(filter.getFirstName())) {
            spec = spec.and(CustomerSpecification.hasFirstName(filter.getFirstName()));
        }

        if(!StringUtil.isNullOrEmpty(filter.getLastName())) {
            spec = spec.and(CustomerSpecification.hasLastName(filter.getLastName()));
        }

        if(!Objects.isNull(filter.getBirthDate())) {
            spec = spec.and(CustomerSpecification.hasBirthDate(filter.getBirthDate()));
        }

        if(!Objects.isNull(filter.getEmail())) {
            spec = spec.and(CustomerSpecification.hasEmail(filter.getEmail()));
        }
        return spec;
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
