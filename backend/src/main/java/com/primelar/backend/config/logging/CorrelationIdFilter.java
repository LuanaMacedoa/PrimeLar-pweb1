package com.primelar.backend.config.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

// garante que o filtro roda uma vez por requisição
@Component
public class CorrelationIdFilter extends OncePerRequestFilter {

    // Nome do header HTTP que carrega o ID
    
    private static final String CORRELATION_ID_HEADER = "X-Correlation-Id";

    // Chave usada para identificar
    private static final String CORRELATION_ID_MDC_KEY = "correlationId";

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            // Tenta pegar o id do header da requisição
            String correlationId = request.getHeader(CORRELATION_ID_HEADER);

            //Se não veio no header, gera uma chave identificadora uncia novo
            if (correlationId == null || correlationId.isBlank()) {
                correlationId = UUID.randomUUID().toString();
            }

            // Coloca o identificador a partir daqui, em todos os logs
            MDC.put(CORRELATION_ID_MDC_KEY, correlationId);

            // Também adiciona informações úteis da requisição
            MDC.put("httpMethod", request.getMethod());           
            MDC.put("requestURI", request.getRequestURI());       
            MDC.put("remoteAddr", request.getRemoteAddr());      

            //Devolve o ID no header da resposta
            response.setHeader(CORRELATION_ID_HEADER, correlationId);

            // ontinua processando as requisições normalmente
            filterChain.doFilter(request, response);

        } finally {
            // SEMPRE limpa o id ao final da requisição, sem isso, threads reutilizadas podem vazar dados de outra requisição
            MDC.remove(CORRELATION_ID_MDC_KEY);
            MDC.remove("httpMethod");
            MDC.remove("requestURI");
            MDC.remove("remoteAddr");
        }
    }
}
