package com.primelar.backend.config.security;

import com.primelar.backend.repository.TokenRevogadoRepository;
import com.primelar.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final TokenRevogadoRepository tokenRepository;

    // Padronizando todas as dependências no mesmo construtor
    public SecurityFilter(TokenService tokenService, UserRepository userRepository, TokenRevogadoRepository tokenRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) 
            throws ServletException, IOException {
        
        var token = this.recoverToken(request);
        
        if (token != null) {
            // 1. Primeiro verifica se o token está na lista negra (revogado no logout)
            if (tokenRepository.existsByToken(token)) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token invalido.");
                return; // Bloqueia a requisição imediatamente
            }

            // 2. Se não estiver revogado, valida e autentica normalmente
            var email = tokenService.validateToken(token);
            if (email != null) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });
            }
        }

        // Continua o fluxo normal para as próximas etapas
        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}