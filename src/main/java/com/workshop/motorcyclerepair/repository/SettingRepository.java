package com.workshop.motorcyclerepair.repository;

import com.workshop.motorcyclerepair.model.Setting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Setting, String> {
}
