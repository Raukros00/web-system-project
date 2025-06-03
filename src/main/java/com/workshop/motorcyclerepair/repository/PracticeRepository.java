package com.workshop.motorcyclerepair.repository;

import com.workshop.motorcyclerepair.model.Practice;
import com.workshop.motorcyclerepair.utils.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.parameters.P;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PracticeRepository extends JpaRepository<Practice, Long>, JpaSpecificationExecutor<Practice> {

    @Query("SELECT p FROM Practice p WHERE p.id = :practiceId AND p.vehicle.nameplate = :nameplate")
    Optional<Practice> findByIdAndAndNameplate(@Param("practiceId") Long practiceId, @Param("nameplate") String nameplate);

    List<Practice> findByStatusIn(List<Status> status);

}
