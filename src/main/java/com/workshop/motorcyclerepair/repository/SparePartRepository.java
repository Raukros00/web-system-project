package com.workshop.motorcyclerepair.repository;

import com.workshop.motorcyclerepair.model.SparePart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface SparePartRepository extends JpaRepository<SparePart, Long>, JpaSpecificationExecutor<SparePart> {

}
