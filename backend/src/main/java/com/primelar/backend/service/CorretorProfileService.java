package com.primelar.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.dto.request.CorretorProfileRequest;
import com.primelar.backend.model.dto.response.CorretorProfileResponse;
import com.primelar.backend.model.entity.CorretorProfile;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.repository.CorretorProfileRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class CorretorProfileService {

    private final CorretorProfileRepository corretorProfileRepository;

    public CorretorProfileService(CorretorProfileRepository corretorProfileRepository) {
        this.corretorProfileRepository = corretorProfileRepository;
    }

    @Transactional(readOnly = true)
    public CorretorProfileResponse getMeuPerfil() {
        User user = usuarioAutenticado();
        CorretorProfile perfil = corretorProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new EntityNotFoundException("Perfil de corretor não encontrado."));
        return toResponse(perfil);
    }

    @Transactional
    public CorretorProfileResponse atualizarPerfil(CorretorProfileRequest request) {
        User user = usuarioAutenticado();
        CorretorProfile perfil = corretorProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new EntityNotFoundException("Perfil de corretor não encontrado."));

        perfil.setCreci(request.creci());
        perfil.setTelefone(request.telefone());
        perfil.setBio(request.bio());

        return toResponse(corretorProfileRepository.save(perfil));
    }

    @Transactional(readOnly = true)
    public CorretorProfileResponse getPerfilPublico(Long id) {
        CorretorProfile perfil = corretorProfileRepository.findById(id)
            .orElseThrow(() -> new EntityNotFoundException("Corretor não encontrado."));
        return toResponse(perfil);
    }

    @Transactional
    public void criarPerfilVazio(User user) {
        CorretorProfile perfil = new CorretorProfile();
        perfil.setUser(user);
        corretorProfileRepository.save(perfil);
    }

    private User usuarioAutenticado() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private CorretorProfileResponse toResponse(CorretorProfile p) {
        return new CorretorProfileResponse(
            p.getId(),
            p.getUser().getId(),
            p.getUser().getFirstname(),
            p.getUser().getLastname(),
            p.getUser().getEmail(),
            p.getCreci(),
            p.getTelefone(),
            p.getBio()
        );
    }
}
