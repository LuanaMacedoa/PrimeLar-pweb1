package com.primelar.backend.model.dto.response;

import java.util.Set;

public record UserResponseDTO(
    Long id,
    String firstname,
    String lastname,
    String email,
    Boolean active,
    Set<String> roles
) {}
