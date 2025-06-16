package com.workshop.motorcyclerepair.repository.specification;

import com.workshop.motorcyclerepair.model.SparePart;
import org.springframework.data.jpa.domain.Specification;

public class SparePartSpecification {

    public static Specification<SparePart> isAvailable() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("quantity"), 0);
    }

}
