package com.workshop.motorcyclerepair.repository.specification;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.model.Customer;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;
import java.util.Date;
import java.util.Objects;

public class CustomerSpecification {


    public static Specification<Customer> hasNameOrSurname(String nameOrSurname) {
        return (root, query, criteriaBuilder) -> {
            if (nameOrSurname == null || nameOrSurname.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return buildNameOrSurnamePredicate(nameOrSurname, root, criteriaBuilder);
        };
    }

    public static Predicate buildNameOrSurnamePredicate(String nameOrSurname, Path<?> root, CriteriaBuilder criteriaBuilder) {
        String likeSearch = "%" + nameOrSurname.trim().toLowerCase() + "%";

        Expression<String> firstName = criteriaBuilder.lower(root.get("firstName"));
        Expression<String> lastName = criteriaBuilder.lower(root.get("lastName"));
        Expression<String> fullName = criteriaBuilder.lower(
                criteriaBuilder.concat(
                        criteriaBuilder.concat(root.get("firstName"), " "),
                        root.get("lastName")
                )
        );

        return criteriaBuilder.or(
                criteriaBuilder.like(firstName, likeSearch),
                criteriaBuilder.like(lastName, likeSearch),
                criteriaBuilder.like(fullName, likeSearch)
        );
    }

    public static Specification<Customer> hasEmail(String email) {
        return ((root, query, criteriaBuilder) -> StringUtil.isNullOrEmpty(email) ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("email"), email.toLowerCase()));
    }

    public static Specification<Customer> hasPhoneNumber(String phoneNumber) {
        return ((root, query, criteriaBuilder) -> StringUtil.isNullOrEmpty(phoneNumber) ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("phoneNumber"), phoneNumber));
    }


    public static Specification<Customer> hasBirthDate(LocalDate birthDate) {
        return (((root, query, criteriaBuilder) -> Objects.isNull(birthDate) ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("birthDate"), birthDate)));
    }

}
