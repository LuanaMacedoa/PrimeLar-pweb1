package com.primelar.backend.model.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity

@Table(name = "token_revogado")

public class TokenRevogado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000, unique = true)
    private String token;

    @Column(name = "data_expiracao")
    private LocalDateTime dataExpiracao;

    public TokenRevogado() {
    }

    public TokenRevogado(String token, LocalDateTime dataExpiracao) {
        this.token = token;
        this.dataExpiracao = dataExpiracao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public LocalDateTime getDataExpiracao() { return dataExpiracao; }
    public void setDataExpiracao(LocalDateTime dataExpiracao) { this.dataExpiracao = dataExpiracao; }
}
    
