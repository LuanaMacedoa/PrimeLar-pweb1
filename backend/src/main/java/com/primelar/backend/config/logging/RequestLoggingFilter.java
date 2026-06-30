package com.primelar.backend.config.logging;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

@Component
@Order(2)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    // Rotas que envolvem credenciais ou tokens — não logar para não facilitar mapeamento de alvos
    private static final Set<String> SENSITIVE_PATHS = Set.of(
        "/auth/login",
        "/auth/register",
        "/auth/reset-password",
        "/auth/forgot-password"
    );

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        if (SENSITIVE_PATHS.contains(request.getRequestURI())) {
            filterChain.doFilter(request, response);
            return;
        }

        long inicio = System.currentTimeMillis();
        log.info(">>> REQUEST  {} {}", request.getMethod(), request.getRequestURI());

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duracao = System.currentTimeMillis() - inicio;
            log.info("<<< RESPONSE {} {} | status={} | {}ms",
                request.getMethod(),
                request.getRequestURI(),
                response.getStatus(),
                duracao
            );
        }
    }
}
