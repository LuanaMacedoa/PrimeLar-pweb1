package com.primelar.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Locale;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ImageStorageService {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public String salvarImagemImovel(MultipartFile imagem) {
        if (imagem == null || imagem.isEmpty()) {
            return null;
        }

        String contentType = imagem.getContentType();
        String originalName = imagem.getOriginalFilename() == null ? "" : imagem.getOriginalFilename();
        String ext = extrairExtensao(originalName).toLowerCase(Locale.ROOT);
        boolean tipoValido = (contentType != null && contentType.toLowerCase(Locale.ROOT).startsWith("image/"))
                || java.util.Set.of(".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp").contains(ext);
        if (!tipoValido) {
            throw new IllegalArgumentException("O arquivo enviado deve ser uma imagem (jpg, png, gif, webp ou bmp).");
        }

        try {
            Path dir = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(dir);

            String extension = extrairExtensao(originalName);
            String nomeArquivo = UUID.randomUUID() + extension;

            Path destino = dir.resolve(nomeArquivo);
            Files.copy(imagem.getInputStream(), destino);

            return "/uploads/" + nomeArquivo;
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível salvar a imagem.", e);
        }
    }

    private String extrairExtensao(String filename) {
        int lastDot = filename.lastIndexOf('.');
        if (lastDot < 0 || lastDot == filename.length() - 1) {
            return ".jpg";
        }
        return filename.substring(lastDot).toLowerCase(Locale.ROOT);
    }
}