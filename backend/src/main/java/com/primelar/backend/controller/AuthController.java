package com.primelar.backend.controller;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.primelar.backend.config.security.TokenService;
import com.primelar.backend.model.dto.request.LoginRequest;
import com.primelar.backend.model.dto.request.PasswordResetRequest;
import com.primelar.backend.model.dto.request.RegisterRequest;
import com.primelar.backend.model.dto.request.ResetPasswordRequest;
import com.primelar.backend.model.dto.response.LoginResponse;
import com.primelar.backend.model.dto.response.PasswordResetResponse;
import com.primelar.backend.model.dto.response.RegisterResponse;
import com.primelar.backend.model.dto.response.ResetPasswordResponse;
import com.primelar.backend.model.entity.PasswordResetToken;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.model.enums.UserRole;
import com.primelar.backend.repository.PasswordResetTokenRepository;
import com.primelar.backend.repository.UserRepository;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody LoginRequest body){
        User user = this.repository.findByEmail(body.getEmail()).orElseThrow(() -> new RuntimeException("User not found"));
        if(passwordEncoder.matches(body.getPassword(), user.getPassword())) {
            String token = this.tokenService.generateToken(user);
            return ResponseEntity.ok(new LoginResponse(user.getFirstname(), token));
        }
        return ResponseEntity.badRequest().build();
    }


    @PostMapping("/register")
    public ResponseEntity register(@RequestBody RegisterRequest body){
        Optional<User> user = this.repository.findByEmail(body.getEmail());

        if(user.isEmpty()) {
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.getPassword()));
            newUser.setEmail(body.getEmail());
            newUser.setFirstname(body.getFirstname());
            newUser.setLastname(body.getLastname());
            newUser.setCreatedAd(LocalDateTime.now());
            newUser.setActive(true);
            newUser.setRole(UserRole.USER);
            this.repository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new RegisterResponse(newUser.getFirstname(), token));
        }
        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<PasswordResetResponse> forgotPassword(@Valid @RequestBody PasswordResetRequest request) {
        User user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        resetToken.setUsed(false);
        passwordResetTokenRepository.save(resetToken);

        System.out.println("Password reset token generated for " + user.getEmail() + ": " + token);

        return ResponseEntity.ok(new PasswordResetResponse(token));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new IllegalArgumentException("Token inválido ou inexistente"));

        if (resetToken.getUsed()) {
            throw new IllegalArgumentException("Este token já foi utilizado");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Token expirado");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        repository.save(user);

        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        return ResponseEntity.ok(new ResetPasswordResponse("Senha redefinida com sucesso"));
    }
}