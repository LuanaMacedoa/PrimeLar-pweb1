package com.primelar.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.primelar.backend.model.dto.request.ImovelRequest;
import com.primelar.backend.model.dto.response.ImovelResponseDTO;
import com.primelar.backend.service.ImovelService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/imoveis")
public class ImovelController {

    private final ImovelService imovelService;

    public ImovelController(ImovelService imovelService) {
        this.imovelService = imovelService;
    }

    @GetMapping
    public ResponseEntity<List<ImovelResponseDTO>> listar() {
        return ResponseEntity.ok(imovelService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ImovelResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(imovelService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<ImovelResponseDTO> cadastrar(
            @Valid @RequestBody ImovelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imovelService.cadastrar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ImovelResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ImovelRequest request) {
        return ResponseEntity.ok(imovelService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        imovelService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}