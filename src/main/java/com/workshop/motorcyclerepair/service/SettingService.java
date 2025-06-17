package com.workshop.motorcyclerepair.service;

import com.workshop.motorcyclerepair.exception.NotFoundException;
import com.workshop.motorcyclerepair.model.Setting;
import com.workshop.motorcyclerepair.repository.SettingRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class SettingService {

    private final SettingRepository settingRepository;

    public String getSetting(String key) {
        Setting setting = settingRepository.findById(key).orElseThrow(() -> new NotFoundException("Setting not found!"));
        return setting.getValue();
    }

    public void setSetting(String key, String value) {
        Setting setting = settingRepository.findById(key).orElseThrow(() -> new NotFoundException("Setting not found!"));
        setting.setValue(value);
        settingRepository.save(setting);
    }

}
