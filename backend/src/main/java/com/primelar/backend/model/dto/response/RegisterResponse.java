package com.primelar.backend.model.dto.response;

import java.time.Instant;
import java.util.Set;

public record RegisterResponse(
    Long id,
    String name,
    String email,
    Set<String> roles,
    String token,
    Instant expiresAt
) {}
