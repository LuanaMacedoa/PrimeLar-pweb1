package com.primelar.backend.model.dto.response;

public record CorretorProfileResponse(
    Long id,
    Long userId,
    String firstname,
    String lastname,
    String email,
    String creci,
    String telefone,
    String bio
) {}
