package com.primelar.backend.model.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Table(
    name = "password_reset_tokens",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_password_reset_token", columnNames = "token")
    },
    indexes = {
        @Index(name = "idx_password_reset_user_id", columnList = "user_id"),
        @Index(name = "idx_password_reset_expires_at", columnList = "expiresAt"),
        @Index(name = "idx_password_reset_used", columnList = "used")
    }
)
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String token;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id", 
        nullable = false,
        foreignKey = @ForeignKey(name = "fk_password_reset_user"))
    private User user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private Boolean used = false;

    public Long getId() { return id; }
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; 
}
    public boolean isUsed() { return used; }
    public void setUsed(boolean used) { this.used = used; }
}
