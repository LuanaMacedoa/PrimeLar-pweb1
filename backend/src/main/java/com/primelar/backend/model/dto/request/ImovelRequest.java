package com.primelar.backend.model.dto.request;

import java.math.BigDecimal;
import lombok.Data;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

@Data

public class ImovelRequest {

    @NotBlank(message = "Título é obrigatório")
    @Size(min = 5, max = 100, message = "Título deve ter entre 5 e 100 caracteres")
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

    @Positive(message = "Quantidade de quartos deve ser positiva")
    private Integer quartos;

    @Positive(message = "Quantidade de banheiros deve ser positiva")
    private Integer banheiros;

    @Positive(message = "Quantidade de vagas deve ser positiva")
    private Integer vagas;
    
    private String caminhoImagem;

}
