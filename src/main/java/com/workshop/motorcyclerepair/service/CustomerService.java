package com.workshop.motorcyclerepair.service;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.dto.customer.CustomerDTO;
import com.workshop.motorcyclerepair.dto.customer.FilterCustomerDTO;
import com.workshop.motorcyclerepair.dto.customer.NewCustomerRequestDTO;
import com.workshop.motorcyclerepair.exception.EntityAlreadyExistsException;
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

    public List<CustomerDTO> getCustomerList(FilterCustomerDTO filter) {
        return customerRepository.findAll(createCustomerSpecification(filter))
                .stream()
                .map(customerMapper::toDTO)
                .toList();
    }

    private static Specification<Customer> createCustomerSpecification(FilterCustomerDTO filter) {
        Specification<Customer> spec = Specification.where(null);

        if(!StringUtil.isNullOrEmpty(filter.nameOrSurname())) {
            spec = spec.and(CustomerSpecification.hasNameOrSurname(filter.nameOrSurname()));
        }

        if(!Objects.isNull(filter.email())) {
            spec = spec.and(CustomerSpecification.hasEmail(filter.email()));
        }

        if(!Objects.isNull(filter.phoneNumber())) {
            spec = spec.and(CustomerSpecification.hasPhoneNumber(filter.phoneNumber()));
        }


        if(!Objects.isNull(filter.birthDate())) {
            spec = spec.and(CustomerSpecification.hasBirthDate(filter.birthDate()));
        }

        return spec;
    }

    public CustomerDTO addNewCustomer(NewCustomerRequestDTO newCustomerRequestDTO) {
        if (customerRepository.findByPhoneNumber(newCustomerRequestDTO.phoneNumber()).isPresent()) {
            throw new EntityAlreadyExistsException("This customer already exists!");
        }

        Customer newCustomer = customerRepository.save(Customer.builder()
                .firstName(newCustomerRequestDTO.firstName())
                .lastName(newCustomerRequestDTO.lastName())
                .birthDate(newCustomerRequestDTO.birthDate())
                .phoneNumber(newCustomerRequestDTO.phoneNumber())
                .email(newCustomerRequestDTO.email())
                .build()
        );

        return customerMapper.toDTO(newCustomer);
    }

}
