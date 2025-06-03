package com.workshop.motorcyclerepair.repository.specification;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.model.Vehicle;
import org.springframework.data.jpa.domain.Specification;

public class VehicleSpecification {

    public static Specification<Vehicle> hasNameplate(String nameplate) {
        return ((root, query, criteriaBuilder) -> StringUtil.isNullOrEmpty(nameplate) ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("nameplate"), nameplate.toLowerCase()));
    }

    public static Specification<Vehicle> hasBrand(String brand) {
        return ((root, query, criteriaBuilder) -> StringUtil.isNullOrEmpty(brand) ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("brand"), brand.toLowerCase()));
    }

    public static Specification<Vehicle> hadModel(String model) {
        return (((root, query, criteriaBuilder) -> StringUtil.isNullOrEmpty(model) ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("model"), model.toLowerCase())));
    }

}
