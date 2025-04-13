package com.workshop.motorcyclerepair.utils;

public enum Role {
    ADMIN,
    ACCEPTANCE_AGENT,
    MECHANIC,
    USER;

    public String asAuthority() {
        return "ROLE_" + this.name();
    }

}
