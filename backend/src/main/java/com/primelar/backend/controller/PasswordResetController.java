package com.primelar.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.PasswordResetRequest;
import com.primelar.backend.model.dto.request.ResetPasswordRequest;
import com.primelar.backend.model.dto.response.PasswordResetResponse;
import com.primelar.backend.model.dto.response.ResetPasswordResponse;
import com.primelar.backend.service.PasswordResetService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/password")
public class PasswordResetController {

    private final PasswordResetService passwordResetService;

    public PasswordResetController(PasswordResetService passwordResetService) {
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/forgot")
    public ResponseEntity<PasswordResetResponse> forgotPassword(
            @Valid @RequestBody PasswordResetRequest request) {

        passwordResetService.solicitarReset(request.getEmail());

        return ResponseEntity.ok(new PasswordResetResponse(
                "Se o e-mail estiver cadastrado, você receberá um link em breve."
        ));
    }

    @PostMapping("/reset")
    public ResponseEntity<ResetPasswordResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        passwordResetService.confirmarReset(request.getToken(), request.getNewPassword());

        return ResponseEntity.ok(new ResetPasswordResponse(
                "Senha redefinida com sucesso!"
        ));
    }

}
