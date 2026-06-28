package com.primelar.backend.model.dto.request;

import com.primelar.backend.model.enums.UserRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequestDTO {
    @NotBlank(message="Nome é obrigatório")
    @Size(min=3, max=100, message="Nome deve ter entre 3 a 100 caracteres")
    private String name;

    @NotBlank(message="Sobrenome é obrigatório")
    @Size(min=3, max=100, message="Sobrenome deve ter entre 3 a 100 caracteres")
    private String lastname;

    @NotBlank(message="Email é obrigatório")
    @Email(message= "Email inválido")
    private String email;

    @NotBlank(message="Senha é obrigatória")
    @Size(min=8, max=100, message="Senha deve ter entre 8 a 100 caracteres")
    private String password;

    @NotNull(message="Role é obrigatória")
    private UserRole role;
}
