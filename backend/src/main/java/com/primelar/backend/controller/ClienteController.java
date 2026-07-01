package com.primelar.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.ClienteProfileRequest;
import com.primelar.backend.model.dto.response.ClienteProfileResponse;
import com.primelar.backend.service.ClienteProfileService;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteProfileService clienteProfileService;

    public ClienteController(ClienteProfileService clienteProfileService) {
        this.clienteProfileService = clienteProfileService;
    }

    @GetMapping("/perfil")
    public ResponseEntity<ClienteProfileResponse> getMeuPerfil() {
        return ResponseEntity.ok(clienteProfileService.getMeuPerfil());
    }

    @PutMapping("/perfil")
    public ResponseEntity<ClienteProfileResponse> atualizarPerfil(@RequestBody ClienteProfileRequest request) {
        return ResponseEntity.ok(clienteProfileService.atualizarPerfil(request));
    }
}
