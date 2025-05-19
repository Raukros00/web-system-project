package com.workshop.motorcyclerepair.repository.specification;

import com.workshop.motorcyclerepair.model.Customer;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class CustomerSpecification {

    public static Specification<Customer> hasFirstName(String firstName) {
        return ((root, query, criteriaBuilder) -> firstName == null ? null : criteriaBuilder.equal(root.get("firstName"), firstName.toLowerCase()));
    }

    public static Specification<Customer> hasLastName(String lastName) {
        return ((root, query, criteriaBuilder) -> lastName == null ? null : criteriaBuilder.equal(root.get("lastName"), lastName.toLowerCase()));
    }

    public static Specification<Customer> hasEmail(String email) {
        return ((root, query, criteriaBuilder) -> email == null ? null : criteriaBuilder.equal(root.get("email"), email.toLowerCase()));
    }

    public static Specification<Customer> hasBirthDate(Date birthDate) {
        return (((root, query, criteriaBuilder) -> birthDate == null ? null : criteriaBuilder.equal(root.get("birthDate"), birthDate)));
    }

}
