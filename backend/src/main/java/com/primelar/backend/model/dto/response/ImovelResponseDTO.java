package com.primelar.backend.model.dto.response;

import java.math.BigDecimal;

public record ImovelResponseDTO(
    Long id,
    String titulo,
    String descricao,
    BigDecimal preco,
    String cidade,
    String bairro,
    String endereco,
    Integer quartos,
    Integer banheiros,
    Integer vagas,
    String caminhoImagem
) {}