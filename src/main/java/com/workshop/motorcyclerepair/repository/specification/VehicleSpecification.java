package com.workshop.motorcyclerepair.repository.specification;

import com.workshop.motorcyclerepair.model.Vehicle;
import org.springframework.data.jpa.domain.Specification;

public class VehicleSpecification {

    public static Specification<Vehicle> hasNameplate(String nameplate) {
        return ((root, query, criteriaBuilder) -> nameplate == null ? null : criteriaBuilder.equal(root.get("nameplate"), nameplate.toLowerCase()));
    }

    public static Specification<Vehicle> hasBrand(String brand) {
        return ((root, query, criteriaBuilder) -> brand == null ? null : criteriaBuilder.equal(root.get("brand"), brand.toLowerCase()));
    }

    public static Specification<Vehicle> hadModel(String model) {
        return (((root, query, criteriaBuilder) -> model == null ? null : criteriaBuilder.equal(root.get("model"), model.toLowerCase())));
    }

}
