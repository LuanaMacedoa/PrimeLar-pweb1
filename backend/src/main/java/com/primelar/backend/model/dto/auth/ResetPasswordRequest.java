package com.primelar.backend.model.dto.auth;

public record ResetPasswordRequest (
    String token,
    String novaSenha

) {}
