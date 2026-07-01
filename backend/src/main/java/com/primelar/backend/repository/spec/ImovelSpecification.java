package com.primelar.backend.repository.spec;

import com.primelar.backend.model.dto.ImovelFiltroDTO;
import com.primelar.backend.model.entity.Imovel;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class ImovelSpecification {

    public static Specification<Imovel> comFiltros(ImovelFiltroDTO filtro) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filtro.getCidade() != null && !filtro.getCidade().isBlank()) {//  evita string vazia ou só espaços.
                predicates.add(cb.like(// faz uma busca parcial com sql
                    cb.lower(root.get("cidade")),
                    "%" + filtro.getCidade().toLowerCase() + "%"
                ));
            }

            if (filtro.getBairro() != null && !filtro.getBairro().isBlank()) {
                predicates.add(cb.like(
                    cb.lower(root.get("bairro")),
                    "%" + filtro.getBairro().toLowerCase() + "%"
                ));
            }

            if (filtro.getPrecoMin() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                    root.get("preco"), filtro.getPrecoMin()
                ));
            }

            if (filtro.getPrecoMax() != null) {
                predicates.add(cb.lessThanOrEqualTo(
                    root.get("preco"), filtro.getPrecoMax()
                ));
            }

            if (filtro.getQuartos() != null) {
                predicates.add(cb.equal(root.get("quartos"), filtro.getQuartos()));
            }

            if (filtro.getBanheiros() != null) {
                predicates.add(cb.equal(root.get("banheiros"), filtro.getBanheiros()));
            }

            if (filtro.getVagas() != null) {
                predicates.add(cb.equal(root.get("vagas"), filtro.getVagas()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
//ele vai combinando os filros entre si, evitando que eu precise fazer código para cada combinação, todos os filtros adicionados na lista são combinados com AND