package com.primelar.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.dto.ImovelFiltroDTO;
import com.primelar.backend.model.dto.request.ImovelRequest;
import com.primelar.backend.model.dto.response.ImovelResponseDTO;
import com.primelar.backend.model.entity.Imovel;
import com.primelar.backend.repository.ImovelRepository;
import com.primelar.backend.repository.spec.ImovelSpecification;

@Service
public class ImovelService {

    private final ImovelRepository imovelRepository;

    public ImovelService(ImovelRepository imovelRepository) {
        this.imovelRepository = imovelRepository;
    }

    @Transactional(readOnly = true)
    public List<ImovelResponseDTO> listar() {
        return imovelRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Page<ImovelResponseDTO> listarComFiltros(ImovelFiltroDTO filtro, Pageable pageable) {
        return imovelRepository.findAll(
                ImovelSpecification.comFiltros(filtro),
                pageable
        ).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public ImovelResponseDTO buscarPorId(Long id) {
        return imovelRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Imóvel não encontrado."));
    }

    @Transactional
    public ImovelResponseDTO cadastrar(ImovelRequest request) {
        Imovel imovel = new Imovel();

        imovel.setTitulo(request.getTitulo());
        imovel.setDescricao(request.getDescricao());
        imovel.setPreco(request.getPreco());
        imovel.setCidade(request.getCidade());
        imovel.setBairro(request.getBairro());
        imovel.setEndereco(request.getEndereco());
        imovel.setQuartos(request.getQuartos());
        imovel.setBanheiros(request.getBanheiros());
        imovel.setVagas(request.getVagas());
        imovel.setCaminhoImagem(request.getCaminhoImagem());

        return toDTO(imovelRepository.save(imovel));
    }

    @Transactional
    public ImovelResponseDTO atualizar(Long id, ImovelRequest request) {
        Imovel imovel = imovelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Imóvel não encontrado."));

        imovel.setTitulo(request.getTitulo());
        imovel.setDescricao(request.getDescricao());
        imovel.setPreco(request.getPreco());
        imovel.setCidade(request.getCidade());
        imovel.setBairro(request.getBairro());
        imovel.setEndereco(request.getEndereco());
        imovel.setQuartos(request.getQuartos());
        imovel.setBanheiros(request.getBanheiros());
        imovel.setVagas(request.getVagas());
        imovel.setCaminhoImagem(request.getCaminhoImagem());

        return toDTO(imovelRepository.save(imovel));
    }

    @Transactional
    public void excluir(Long id) {
        if (!imovelRepository.existsById(id)) {
            throw new RuntimeException("Imóvel não encontrado.");
        }

        imovelRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<ImovelResponseDTO> buscarPorCidade(String cidade) {
        return imovelRepository.findByCidade(cidade).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ImovelResponseDTO> buscarPorTitulo(String titulo) {
        return imovelRepository.findByTituloContainingIgnoreCase(titulo).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private ImovelResponseDTO toDTO(Imovel imovel) {
        return new ImovelResponseDTO(
                imovel.getId(),
                imovel.getTitulo(),
                imovel.getDescricao(),
                imovel.getPreco(),
                imovel.getCidade(),
                imovel.getBairro(),
                imovel.getEndereco(),
                imovel.getQuartos(),
                imovel.getBanheiros(),
                imovel.getVagas(),
                imovel.getCaminhoImagem()
        );
    }
}

//Porque o findAll(..., pageable) retorna Page<Imovel>, mas o controller deve devolver DTO para não expor a entidade diretamente.