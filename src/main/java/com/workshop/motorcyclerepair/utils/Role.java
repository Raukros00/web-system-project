package com.workshop.motorcyclerepair.utils;

import org.springframework.context.annotation.Bean;
public enum Role {
    ADMIN,
    ACCEPTANCE_AGENT,
    MECHANIC,
    WAREHOUSE_WORKER,
    USER;

    public String asAuthority() {
        return "ROLE_" + this.name();
    }

    public static Role getAuthority(String role) {
        String cleanRole = role.replace("ROLE_", "");
        return Role.valueOf(cleanRole);
    }

}
