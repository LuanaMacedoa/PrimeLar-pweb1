package com.primelar.backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImovelResponseDTO> cadastrar(
            @Valid @RequestBody ImovelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imovelService.cadastrar(request));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImovelResponseDTO> cadastrarComImagem(
            @Valid @ModelAttribute ImovelRequest request,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        return ResponseEntity.status(HttpStatus.CREATED).body(imovelService.cadastrar(request, imagem));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ImovelResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ImovelRequest request) {
        return ResponseEntity.ok(imovelService.atualizar(id, request));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImovelResponseDTO> atualizarComImagem(
            @PathVariable Long id,
            @Valid @ModelAttribute ImovelRequest request,
            @RequestPart(value = "imagem", required = false) MultipartFile imagem) {
        return ResponseEntity.ok(imovelService.atualizar(id, request, imagem));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        imovelService.excluir(id);
        return ResponseEntity.noContent().build();
    }

}