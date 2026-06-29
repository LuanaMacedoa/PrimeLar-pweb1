package com.primelar.backend.controller;

import static org.junit.jupiter.api.Assertions.*;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.dto.auth.ForgotPasswordRequest;
import com.primelar.backend.model.dto.auth.ResetPasswordRequest;
import com.primelar.backend.model.entity.PasswordResetToken;
import com.primelar.backend.model.entity.Role;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.repository.PasswordResetTokenRepository;
import com.primelar.backend.repository.RoleRepository;
import com.primelar.backend.repository.UserRepository;

@SpringBootTest
@Transactional
class AuthControllerTest {

    @Autowired
    private AuthController authController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        tokenRepository.deleteAll();
        userRepository.deleteAll();

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new IllegalStateException("Role USER não encontrada — verifique DataInitializer"));

        testUser = new User();
        testUser.setFirstname("John");
        testUser.setLastname("Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setPassword(passwordEncoder.encode("oldPassword123"));
        testUser.setCreatedAd(LocalDateTime.now());
        testUser.setActive(true);
        testUser.setRoles(Set.of(userRole));
        userRepository.save(testUser);
    }

    @Test
    void shouldReturnOkForValidEmail() {
        ForgotPasswordRequest request = new ForgotPasswordRequest("john.doe@example.com");

        ResponseEntity<String> response = authController.forgotPassword(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }

    @Test
    void shouldReturnOkForInvalidEmail() {
        ForgotPasswordRequest request = new ForgotPasswordRequest("naoexiste@email.com");

        ResponseEntity<String> response = authController.forgotPassword(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void shouldResetPasswordWithValidToken() {
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken("token-de-teste-123");
        resetToken.setUser(testUser);
        resetToken.setExpiresAt(LocalDateTime.now().plusMinutes(30));
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        ResetPasswordRequest request = new ResetPasswordRequest("token-de-teste-123", "novaSenha456");

        ResponseEntity<String> response = authController.resetPassword(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());

        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("novaSenha456", updatedUser.getPassword()));

        PasswordResetToken usedToken = tokenRepository.findByToken("token-de-teste-123").orElseThrow();
        assertTrue(usedToken.isUsed());
    }

    @Test
    void shouldReturnBadRequestForExpiredToken() {
        PasswordResetToken expiredToken = new PasswordResetToken();
        expiredToken.setToken("token-expirado-123");
        expiredToken.setUser(testUser);
        expiredToken.setExpiresAt(LocalDateTime.now().minusMinutes(1));
        expiredToken.setUsed(false);
        tokenRepository.save(expiredToken);

        ResetPasswordRequest request = new ResetPasswordRequest("token-expirado-123", "qualquerSenha");

        ResponseEntity<String> response = authController.resetPassword(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}
