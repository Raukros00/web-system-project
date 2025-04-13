package com.workshop.motorcyclerepair.repository;

import com.workshop.motorcyclerepair.model.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    Optional<User> findByUsername(String username);
    public Optional<User> findByEmail(String email);
}
