package com.workshop.motorcyclerepair.exception;

public class EntityAlreadyExistsException extends RuntimeException {
    public EntityAlreadyExistsException(String message) { super(message); }
}
