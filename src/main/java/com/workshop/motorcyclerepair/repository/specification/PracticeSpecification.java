package com.workshop.motorcyclerepair.repository.specification;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.model.Customer;
import com.workshop.motorcyclerepair.model.Practice;
import com.workshop.motorcyclerepair.model.Vehicle;
import jakarta.persistence.criteria.Join;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Objects;

public class PracticeSpecification {

    public static Specification<Practice> hasStatus(List<String> status) {
        return (((root, query, criteriaBuilder) -> (Objects.isNull(status) || status.isEmpty()) ? criteriaBuilder.conjunction() : root.get("status").in(status)));
    }

    public static Specification<Practice> hasNameOrSurname(String nameOrSurname) {
        return (root, query, criteriaBuilder) -> {
            if (StringUtil.isNullOrEmpty(nameOrSurname)) {
                return criteriaBuilder.conjunction();
            }

            Join<Practice, Customer> customer = root.join("customer");
            return CustomerSpecification.buildNameOrSurnamePredicate(nameOrSurname, customer, criteriaBuilder);
        };
    }

    public static Specification<Practice> hasBrand(String brand) {
        return (root, query, criteriaBuilder) -> {
            if (StringUtil.isNullOrEmpty(brand)) {
                return criteriaBuilder.conjunction();
            }

            Join<Practice, Vehicle> vehicle = root.join("vehicle");
            return criteriaBuilder.equal(vehicle.get("brand"), brand.toLowerCase());
        };
    }

    public static Specification<Practice> hasModel(String model) {
        return (root, query, criteriaBuilder) -> {
            if (StringUtil.isNullOrEmpty(model)) {
                return criteriaBuilder.conjunction();
            }

            Join<Practice, Vehicle> vehicle = root.join("vehicle");
            return criteriaBuilder.equal(vehicle.get("model"), model.toLowerCase());
        };
    }

    public static Specification<Practice> hasNameplate(String nameplate) {
        return (root, query, criteriaBuilder) -> {
            if (StringUtil.isNullOrEmpty(nameplate)) {
                return criteriaBuilder.conjunction();
            }

            Join<Practice, Vehicle> vehicle = root.join("vehicle");
            return criteriaBuilder.equal(vehicle.get("nameplate"), nameplate.toLowerCase());
        };
    }

}
