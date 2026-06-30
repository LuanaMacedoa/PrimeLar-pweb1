package com.primelar.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.primelar.backend.model.entity.CorretorProfile;

public interface CorretorProfileRepository extends JpaRepository<CorretorProfile, Long> {
    Optional<CorretorProfile> findByUserId(Long userId);
}
