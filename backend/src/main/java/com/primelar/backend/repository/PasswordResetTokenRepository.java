package com.primelar.backend.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.primelar.backend.model.entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token); //Busca um token pelo seu valor usado na confirmação
    void deleteAllByUserId(Long userId); //limpa antes de gerar um novo token
}
