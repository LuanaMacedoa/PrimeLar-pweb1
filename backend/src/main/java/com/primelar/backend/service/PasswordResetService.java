package com.primelar.backend.service;

import com.primelar.backend.model.entity.PasswordResetToken;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.repository.PasswordResetTokenRepository;
import com.primelar.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public PasswordResetService(
        UserRepository userRepository,
        PasswordResetTokenRepository tokenRepository,
        EmailService emailService,
        PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    // user vai informar email
    @Transactional
    public void solicitarReset(String email) {
        // Busca o usuário
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Deleta tokens antigos antes de gerar novos
        tokenRepository.deleteAllByUserId(user.getId());

        // Gera um token único (UUID)
        String token = UUID.randomUUID().toString();

        // Cria e salva o token no banco com 30 minutos de validade
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        // Envia o e-mail com o link
        emailService.enviarEmailResetSenha(email, token);
    }

    // confirmação de token e nova senha
    @Transactional
    public void confirmarReset(String token, String novaSenha) {
        // Busca o token no banco
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
            .orElseThrow(() -> new IllegalArgumentException("Token inválido"));

        // Verifica se o token já foi usado
        if (resetToken.isUsed()) {
            throw new IllegalArgumentException("Token já utilizado");
        }

        // Verifica se o token expirou
        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado. Solicite um novo reset.");
        }

        // Atualiza a senha do usuário com hash BCrypt
        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(novaSenha));
        userRepository.save(user);

        // Marca o token como usado para não reutilizar
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}