package com.primelar.backend.config.security;

import com.primelar.backend.repository.TokenRevogadoRepository;
import com.primelar.backend.repository.UserRepository;
import com.primelar.backend.shared.exception.StandardError;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import tools.jackson.databind.ObjectMapper;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final TokenRevogadoRepository tokenRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public SecurityFilter(TokenService tokenService, UserRepository userRepository,
                          TokenRevogadoRepository tokenRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        var token = recoverToken(request);

        if (token != null) {
            if (tokenRepository.existsByToken(token)) {
                writeUnauthorized(response, request.getRequestURI(), "Token revogado. Faça login novamente.");
                return;
            }

            var email = tokenService.validateToken(token);
            if (email != null) {
                userRepository.findByEmail(email).ifPresent(user -> {
                    var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                });
            }
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }

    private void writeUnauthorized(HttpServletResponse response, String path, String message) throws IOException {
        StandardError error = StandardError.builder()
                .timestamp(Instant.now())
                .status(HttpServletResponse.SC_UNAUTHORIZED)
                .error("Não Autenticado")
                .message(message)
                .path(path)
                .build();

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(error));
    }
}
