package com.primelar.backend.model.dto;

import lombok.Data;

@Data
public class ImovelFiltroDTO {
    private String cidade;
    private String bairro;
    private java.math.BigDecimal precoMin;
    private java.math.BigDecimal precoMax;
    private Integer quartos;
    private Integer banheiros;
    private Integer vagas;
}