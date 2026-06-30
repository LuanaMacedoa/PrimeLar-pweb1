package com.primelar.backend.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "corretor_profiles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = "user")
@ToString(exclude = "user")
public class CorretorProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(length = 50, unique = true)
    private String creci;

    @Column(length = 20)
    private String telefone;

    @Column(columnDefinition = "TEXT")
    private String bio;
}
