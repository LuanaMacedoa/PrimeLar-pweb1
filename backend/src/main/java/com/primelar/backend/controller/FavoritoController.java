package com.primelar.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.FavoritoRequest;
import com.primelar.backend.model.dto.response.FavoritoResponseDTO;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    @GetMapping
    public ResponseEntity<List<FavoritoResponseDTO>> listarFavoritos() {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

    @PostMapping
    public ResponseEntity<FavoritoResponseDTO> favoritar(
            @Valid @RequestBody FavoritoRequest request) {

        // TODO: implementar

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desfavoritar(@PathVariable Long id) {

        // TODO: implementar

        return ResponseEntity.noContent().build();
    }

}