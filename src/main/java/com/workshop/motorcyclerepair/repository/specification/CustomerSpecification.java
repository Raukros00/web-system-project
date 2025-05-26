package com.workshop.motorcyclerepair.repository.specification;

import com.workshop.motorcyclerepair.model.Customer;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class CustomerSpecification {


    public static Specification<Customer> hasCallsign(String callsign) {
        return (root, query, criteriaBuilder) -> {
            if (callsign == null || callsign.isBlank()) {
                return null;
            }

            String trimmed = callsign.trim();

            if (trimmed.contains(" ")) {
                String[] parts = trimmed.split(" ", 2);
                String nome = parts[0];
                String cognome = parts[1];

                return criteriaBuilder.and(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), nome.toLowerCase() + "%"),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), cognome.toLowerCase() + "%")
                );
            } else {
                String pattern = trimmed.toLowerCase() + "%";

                return criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), pattern),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), pattern)
                );
            }
        };
    }

    public static Specification<Customer> hasEmail(String email) {
        return ((root, query, criteriaBuilder) -> email == null ? null : criteriaBuilder.equal(root.get("email"), email.toLowerCase()));
    }

    public static Specification<Customer> hasPhoneNumber(String phoneNumber) {
        return ((root, query, criteriaBuilder) -> phoneNumber == null ? null : criteriaBuilder.in(root.get("phoneNumber")));
    }


    public static Specification<Customer> hasBirthDate(Date birthDate) {
        return (((root, query, criteriaBuilder) -> birthDate == null ? null : criteriaBuilder.equal(root.get("birthDate"), birthDate)));
    }

}
