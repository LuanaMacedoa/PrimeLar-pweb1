package com.primelar.backend.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.primelar.backend.model.entity.Imovel;

@Repository
public interface ImovelRepository extends JpaRepository<Imovel, Long> {

    List<Imovel> findByCidade(String cidade);

    List<Imovel> findByPrecoBetween(BigDecimal minimo, BigDecimal maximo);

    List<Imovel> findByTituloContainingIgnoreCase(String titulo);

}