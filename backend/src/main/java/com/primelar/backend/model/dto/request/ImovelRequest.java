package com.primelar.backend.model.dto.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data

public class ImovelRequest {

    @NotBlank(message = "Título é obrigatório")
    @Size(min = 4, max = 150, message = "Título deve ter entre 4 e 150 caracteres")
    private String titulo;

    @Size(max = 1000, message = "Descrição deve ter no máximo 1000 caracteres")
    private String descricao;

    @NotNull(message = "Preço é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço deve ser maior que zero")
    private BigDecimal preco;

    @NotBlank(message = "Cidade é obrigatória")
    private String cidade;

    @NotBlank(message = "Bairro é obrigatório")
    private String bairro;

    private String endereco;

    @Min(value = 1, message = "Quantidade de quartos deve ser ao menos 1")
    private Integer quartos;

    @Min(value = 1, message = "Quantidade de banheiros deve ser ao menos 1")
    private Integer banheiros;

    @PositiveOrZero(message = "Quantidade de vagas não pode ser negativa")
    private Integer vagas;
    
    private String caminhoImagem;

}
