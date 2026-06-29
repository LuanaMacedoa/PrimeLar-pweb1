package com.primelar.backend.model.dto.response;
import com.primelar.backend.model.enums.UserRole;

public record UserResponseDTO(
    Long id,
    String firstname,
    String lastname,
    String email,
    Boolean active,
    UserRole role
) {}
