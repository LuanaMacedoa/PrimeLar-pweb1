package com.primelar.backend.service;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.dto.request.ClienteProfileRequest;
import com.primelar.backend.model.dto.response.ClienteProfileResponse;
import com.primelar.backend.model.entity.ClienteProfile;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.repository.ClienteProfileRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ClienteProfileService {

    private final ClienteProfileRepository clienteProfileRepository;

    public ClienteProfileService(ClienteProfileRepository clienteProfileRepository) {
        this.clienteProfileRepository = clienteProfileRepository;
    }

    @Transactional(readOnly = true)
    public ClienteProfileResponse getMeuPerfil() {
        User user = usuarioAutenticado();
        ClienteProfile perfil = clienteProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new EntityNotFoundException("Perfil de cliente não encontrado."));
        return toResponse(perfil);
    }

    @Transactional
    public ClienteProfileResponse atualizarPerfil(ClienteProfileRequest request) {
        User user = usuarioAutenticado();
        ClienteProfile perfil = clienteProfileRepository.findByUserId(user.getId())
            .orElseThrow(() -> new EntityNotFoundException("Perfil de cliente não encontrado."));

        perfil.setTelefone(request.telefone());
        perfil.setCpf(request.cpf());
        perfil.setPreferencias(request.preferencias());

        return toResponse(clienteProfileRepository.save(perfil));
    }

    @Transactional
    public void criarPerfilVazio(User user) {
        ClienteProfile perfil = new ClienteProfile();
        perfil.setUser(user);
        clienteProfileRepository.save(perfil);
    }

    private User usuarioAutenticado() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    private ClienteProfileResponse toResponse(ClienteProfile p) {
        return new ClienteProfileResponse(
            p.getId(),
            p.getUser().getId(),
            p.getUser().getFirstname(),
            p.getUser().getLastname(),
            p.getUser().getEmail(),
            p.getTelefone(),
            p.getCpf(),
            p.getPreferencias()
        );
    }
}
