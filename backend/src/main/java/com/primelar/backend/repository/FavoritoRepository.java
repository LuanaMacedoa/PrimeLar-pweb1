package com.primelar.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.primelar.backend.model.entity.Favorito;

@Repository
public interface FavoritoRepository extends JpaRepository<Favorito, Long> {

    List<Favorito> findByUserId(Long userId);

    Optional<Favorito> findByUserIdAndImovelId(Long userId, Long imovelId);

    boolean existsByUserIdAndImovelId(Long userId, Long imovelId);

    void deleteByUserIdAndImovelId(Long userId, Long imovelId);

}