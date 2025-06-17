package com.workshop.motorcyclerepair.repository.specification;

import ch.qos.logback.core.util.StringUtil;
import com.workshop.motorcyclerepair.model.SparePart;
import org.springframework.data.jpa.domain.Specification;
import java.util.Objects;

public class SparePartSpecification {

    public static Specification<SparePart> isAvailable() {
        return (root, query, criteriaBuilder) -> criteriaBuilder.greaterThan(root.get("quantity"), 0);
    }

    public static Specification<SparePart> hasId(Long id) {
        return (((root, query, criteriaBuilder) -> Objects.isNull(id) ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("id"), id)));
    }

    public static Specification<SparePart> hasPartName(String partName) {
        return (((root, query, criteriaBuilder) -> StringUtil.isNullOrEmpty(partName) ? criteriaBuilder.conjunction() : criteriaBuilder.like(root.get("partName"), "%" + partName + "%")));
    }

    public static Specification<SparePart> hasQuantity(int quantity) {
        return (((root, query, criteriaBuilder) -> criteriaBuilder.equal(root.get("quantity"), quantity)));
    }

}
