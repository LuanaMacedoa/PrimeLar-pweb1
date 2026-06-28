package com.primelar.backend.model.dto.request;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FavoritoRequest {

    @NotNull(message = "Imóvel é obrigatório")
    private Long imovelId;

}