package com.primelar.backend.model.dto.request;

import com.primelar.backend.model.enums.UserRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequestDTO {
    @NotBlank(message="Nome é obrigatório")
    @Size(min=3, max=100, message="Nome deve ter entre 3 a 100 caracteres")
    private String firstname;

    @NotBlank(message="Sobrenome é obrigatório")
    @Size(min=3, max=100, message="Sobrenome deve ter entre 3 a 100 caracteres")
    private String lastname;

    @NotBlank(message="Email é obrigatório")
    @Email(message= "Email inválido")
    private String email;

    private String password;

    @NotNull(message="Role é obrigatória")
    private UserRole role;

    @NotNull(message="Status ativo/inativo é obrigatório")
    private Boolean active;
}
