package com.workshop.motorcyclerepair.exception;

import org.springframework.http.HttpStatus;

public record ErrorResponse(
        HttpStatus error,
        String description
) { }
