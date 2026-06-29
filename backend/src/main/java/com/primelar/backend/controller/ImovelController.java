package com.primelar.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.ImovelRequest;
import com.primelar.backend.model.dto.response.ImovelResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/imoveis")
public class ImovelController {

    @GetMapping
    public ResponseEntity<List<ImovelResponseDTO>> listar() {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImovelResponseDTO> buscarPorId(@PathVariable Long id) {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<ImovelResponseDTO> cadastrar(
            @Valid @RequestBody ImovelRequest request) {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImovelResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ImovelRequest request) {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        // TODO: implementar

        return ResponseEntity.noContent().build();
    }

}