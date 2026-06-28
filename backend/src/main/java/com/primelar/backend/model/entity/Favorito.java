package com.primelar.backend.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "favoritos",
    uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "imovel_id"})
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Favorito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "imovel_id")
    private Imovel imovel;
}
