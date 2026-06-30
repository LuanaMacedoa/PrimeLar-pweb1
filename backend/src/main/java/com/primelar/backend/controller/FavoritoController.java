package com.primelar.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.FavoritoRequest;
import com.primelar.backend.model.dto.response.FavoritoResponseDTO;
import com.primelar.backend.service.FavoritoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/favoritos")
public class FavoritoController {

    private final FavoritoService favoritoService;

    public FavoritoController(FavoritoService favoritoService) {
        this.favoritoService = favoritoService;
    }

    @GetMapping
    public ResponseEntity<List<FavoritoResponseDTO>> listarFavoritos() {
        return ResponseEntity.ok(favoritoService.listarFavoritos());
    }

    @PostMapping
    public ResponseEntity<FavoritoResponseDTO> favoritar(
            @Valid @RequestBody FavoritoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(favoritoService.favoritar(request.getImovelId()));
    }

    @DeleteMapping("/{imovelId}")
    public ResponseEntity<Void> desfavoritar(@PathVariable Long imovelId) {
        favoritoService.desfavoritar(imovelId);
        return ResponseEntity.noContent().build();
    }

}