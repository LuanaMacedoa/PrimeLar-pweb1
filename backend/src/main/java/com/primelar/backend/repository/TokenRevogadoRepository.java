package com.primelar.backend.repository;

import com.primelar.backend.model.entity.TokenRevogado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRevogadoRepository extends JpaRepository<TokenRevogado, Long> {
    
    //ve se tá na lista negra
    Optional<TokenRevogado> findByToken(String token);
    
    // ve se existe
    boolean existsByToken(String token);
}
