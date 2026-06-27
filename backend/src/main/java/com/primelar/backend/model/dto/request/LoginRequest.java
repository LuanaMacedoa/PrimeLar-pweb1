package com.primelar.backend.model.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message="Email é obrigatório")
    @Email(message= "Email inválidos")
    private String email;

    @NotBlank(message="Senha é obrigatória")
    @Size(min=8, max=100, message="Senha deve ter entre 8 a 100 caracteres")
    private String passwordHash;
}
