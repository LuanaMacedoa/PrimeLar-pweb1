package com.primelar.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "favoritos",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_favorito_user_imovel", columnNames = {"user_id", "imovel_id"})
    },
    indexes = {
        @Index(name = "idx_favoritos_user_id", columnList = "user_id"),
        @Index(name = "idx_favoritos_imovel_id", columnList = "imovel_id")
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_favorito_user")
    )
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
        name = "imovel_id",
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_favorito_imovel")
    )
    private Imovel imovel;
}