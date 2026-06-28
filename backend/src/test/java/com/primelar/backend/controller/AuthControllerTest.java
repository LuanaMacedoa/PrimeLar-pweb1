package com.primelar.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.dto.request.PasswordResetRequest;
import com.primelar.backend.model.dto.request.ResetPasswordRequest;
import com.primelar.backend.model.dto.response.PasswordResetResponse;
import com.primelar.backend.model.dto.response.ResetPasswordResponse;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.model.entity.PasswordResetToken;
import com.primelar.backend.model.enums.UserRole;
import com.primelar.backend.repository.UserRepository;
import com.primelar.backend.repository.PasswordResetTokenRepository;

@SpringBootTest
@Transactional
class AuthControllerTest {

    @Autowired
    private AuthController authController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        tokenRepository.deleteAll();
        userRepository.deleteAll();

        testUser = new User();
        testUser.setName("John");
        testUser.setLastname("Doe");
        testUser.setEmail("john.doe@example.com");
        testUser.setPassword(passwordEncoder.encode("oldPassword123"));
        testUser.setCreatedAd(LocalDateTime.now());
        testUser.setActive(true);
        testUser.setRole(UserRole.USER);
        userRepository.save(testUser);
    }

    @Test
    void shouldGenerateResetTokenForValidUser() {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("john.doe@example.com");

        ResponseEntity<PasswordResetResponse> responseEntity = authController.forgotPassword(request);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());

        PasswordResetResponse response = responseEntity.getBody();
        assertNotNull(response);
        assertNotNull(response.message());
        assertFalse(response.message().isEmpty());

        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(response.message());
        assertTrue(tokenOpt.isPresent());
        assertFalse(tokenOpt.get().getUsed());
    }

    @Test
    void shouldResetPasswordWithValidToken() {
        PasswordResetRequest request = new PasswordResetRequest();
        request.setEmail("john.doe@example.com");

        ResponseEntity<PasswordResetResponse> responseEntity = authController.forgotPassword(request);
        String token = responseEntity.getBody().message();

        ResetPasswordRequest resetRequest = new ResetPasswordRequest();
        resetRequest.setToken(token);
        resetRequest.setNewPassword("newSecretPassword123");

        ResponseEntity<ResetPasswordResponse> resetResponseEntity = authController.resetPassword(resetRequest);
        assertEquals(HttpStatus.OK, resetResponseEntity.getStatusCode());

        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("newSecretPassword123", updatedUser.getPassword()));

        PasswordResetToken usedToken = tokenRepository.findByToken(token).orElseThrow();
        assertTrue(usedToken.getUsed());
    }
}
