package com.primelar.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.CorretorProfileRequest;
import com.primelar.backend.model.dto.response.CorretorProfileResponse;
import com.primelar.backend.service.CorretorProfileService;

@RestController
@RequestMapping("/corretores")
public class CorretorController {

    private final CorretorProfileService corretorProfileService;

    public CorretorController(CorretorProfileService corretorProfileService) {
        this.corretorProfileService = corretorProfileService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<CorretorProfileResponse> getPerfilPublico(@PathVariable Long id) {
        return ResponseEntity.ok(corretorProfileService.getPerfilPublico(id));
    }

    @GetMapping("/perfil")
    public ResponseEntity<CorretorProfileResponse> getMeuPerfil() {
        return ResponseEntity.ok(corretorProfileService.getMeuPerfil());
    }

    @PutMapping("/perfil")
    public ResponseEntity<CorretorProfileResponse> atualizarPerfil(@RequestBody CorretorProfileRequest request) {
        return ResponseEntity.ok(corretorProfileService.atualizarPerfil(request));
    }
}
