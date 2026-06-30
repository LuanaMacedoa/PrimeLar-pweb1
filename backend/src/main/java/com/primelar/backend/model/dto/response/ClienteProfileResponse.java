package com.primelar.backend.model.dto.response;

public record ClienteProfileResponse(
    Long id,
    Long userId,
    String firstname,
    String lastname,
    String email,
    String telefone,
    String cpf,
    String preferencias
) {}
