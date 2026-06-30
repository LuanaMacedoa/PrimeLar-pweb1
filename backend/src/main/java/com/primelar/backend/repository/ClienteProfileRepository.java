package com.primelar.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.primelar.backend.model.entity.ClienteProfile;

public interface ClienteProfileRepository extends JpaRepository<ClienteProfile, Long> {
    Optional<ClienteProfile> findByUserId(Long userId);
}
