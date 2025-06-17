package com.workshop.motorcyclerepair.utils;

public enum Role {
    ADMIN,
    ACCEPTANCE_AGENT,
    MECHANIC,
    WAREHOUSE_WORKER,
    CASHIER;

    public String asAuthority() {
        return "ROLE_" + this.name();
    }

    public static Role getAuthority(String role) {
        String cleanRole = role.replace("ROLE_", "");
        return Role.valueOf(cleanRole);
    }

}
