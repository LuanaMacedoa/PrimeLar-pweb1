package com.primelar.backend.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor; // biblioteca spring que já tem buscas dinâmicas com filtro, no caso ela vai habilitar essas buscas(não é ia, soy jo)
import org.springframework.stereotype.Repository;

import com.primelar.backend.model.entity.Imovel;

@Repository
public interface ImovelRepository
        extends JpaRepository<Imovel, Long>,
                JpaSpecificationExecutor<Imovel> {

    List<Imovel> findByCidade(String cidade);
    List<Imovel> findByPrecoBetween(BigDecimal minimo, BigDecimal maximo);
    List<Imovel> findByTituloContainingIgnoreCase(String titulo);
}