package com.primelar.backend.model.entity;

import java.math.BigDecimal;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "imoveis",
    indexes = {
        @Index(name = "idx_imovel_cidade", columnList = "cidade"),
        @Index(name = "idx_imovel_bairro", columnList = "bairro"),
        @Index(name = "idx_imovel_preco", columnList = "preco"),
        @Index(name = "idx_imovel_cidade_bairro", columnList = "cidade,bairro")
    })

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Imovel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 150)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private String cidade;

    @Column(nullable = false)
    private String bairro;

    private String endereco;
    private Integer quartos;
    private Integer banheiros;
    private Integer vagas;

    private String caminhoImagem; 
}
// add not null e notblanck
