package com.primelar.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.dto.response.FavoritoResponseDTO;
import com.primelar.backend.model.entity.Favorito;
import com.primelar.backend.model.entity.Imovel;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.repository.FavoritoRepository;
import com.primelar.backend.repository.ImovelRepository;
import com.primelar.backend.repository.UserRepository;

@Service
public class FavoritoService {

    private final FavoritoRepository favoritoRepository;
    private final ImovelRepository imovelRepository;
    private final UserRepository userRepository;

    public FavoritoService(
            FavoritoRepository favoritoRepository,
            ImovelRepository imovelRepository,
            UserRepository userRepository) {

        this.favoritoRepository = favoritoRepository;
        this.imovelRepository = imovelRepository;
        this.userRepository = userRepository;
    }

    private User getUsuarioLogado() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null) {
            throw new IllegalStateException("Usuário não autenticado.");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User user) {
            return user;
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Usuário autenticado não encontrado."));
    }

    @Transactional(readOnly = true)
    public List<FavoritoResponseDTO> listarFavoritos() {

        User user = getUsuarioLogado();

        return favoritoRepository.findByUserId(user.getId()).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public FavoritoResponseDTO favoritar(Long imovelId) {

        User user = getUsuarioLogado();

        if (favoritoRepository.existsByUserIdAndImovelId(user.getId(), imovelId)) {
            throw new RuntimeException("Imóvel já está favoritado.");
        }

        Imovel imovel = imovelRepository.findById(imovelId)
                .orElseThrow(() -> new RuntimeException("Imóvel não encontrado."));

        Favorito favorito = new Favorito();
        favorito.setUser(user);
        favorito.setImovel(imovel);

        return toDTO(favoritoRepository.save(favorito));
    }

    @Transactional
    public void desfavoritar(Long imovelId) {

        User user = getUsuarioLogado();

        if (!favoritoRepository.existsByUserIdAndImovelId(user.getId(), imovelId)) {
        throw new RuntimeException("Favorito não encontrado.");
            }

        favoritoRepository.deleteByUserIdAndImovelId(user.getId(), imovelId);
    }

    private FavoritoResponseDTO toDTO(Favorito favorito) {
        return new FavoritoResponseDTO(
                favorito.getId(),
                favorito.getUser().getId(),
                favorito.getImovel().getId()
        );
    }
}