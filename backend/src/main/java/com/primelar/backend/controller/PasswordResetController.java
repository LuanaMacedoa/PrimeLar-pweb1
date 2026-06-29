package com.primelar.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.PasswordResetRequest;
import com.primelar.backend.model.dto.request.ResetPasswordRequest;
import com.primelar.backend.model.dto.response.PasswordResetResponse;
import com.primelar.backend.model.dto.response.ResetPasswordResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/password")
public class PasswordResetController {

    @PostMapping("/forgot")
    public ResponseEntity<PasswordResetResponse> forgotPassword(
            @Valid @RequestBody PasswordResetRequest request) {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset")
    public ResponseEntity<ResetPasswordResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

}
