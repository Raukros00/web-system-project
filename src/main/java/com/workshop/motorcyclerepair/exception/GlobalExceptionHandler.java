package com.workshop.motorcyclerepair.exception;

import org.apache.coyote.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final String INVALID_ARGUMENTS_ERROR = "One or more arguments are invalid or missing!";

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException e) {
        return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.NOT_FOUND, e.getMessage()),
                HttpStatus.NOT_FOUND
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException e) {
        return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.BAD_REQUEST, e.getMessage()),
                HttpStatus.BAD_REQUEST
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleInvalidArguments(MethodArgumentNotValidException e) {
        return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.BAD_REQUEST, INVALID_ARGUMENTS_ERROR),
                HttpStatus.BAD_REQUEST
        );
    }
    @ExceptionHandler(EntityAlreadyExistsException.class)
    public ResponseEntity<ErrorResponse> handleEntityAlreadyExistsException(EntityAlreadyExistsException e) {
        return new ResponseEntity<>(
                new ErrorResponse(HttpStatus.CONFLICT, e.getMessage()),
                HttpStatus.CONFLICT
        );
    }

    @ExceptionHandler(NoSuchElementException.class) // o EntityNotFoundException, ecc.
    public ResponseEntity<Map<String, Object>> handleNotFound(Exception ex) {
        Map<String, Object> response = new HashMap<>();
        response.put("timestamp", LocalDateTime.now());
        response.put("status", 404);
        response.put("error", "Not Found");
        response.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

}
