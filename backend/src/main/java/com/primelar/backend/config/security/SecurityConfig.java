package com.primelar.backend.config.security;

import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.Filter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final SecurityFilter securityFilter;

    @Value("${primelar.cors.allowed-origins:http://localhost:4200}")
    private List<String> allowedOrigins;

    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/register").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/forgot-password").permitAll()
                        .requestMatchers(HttpMethod.POST, "/auth/reset-password").permitAll()
                    .requestMatchers(HttpMethod.POST, "/password/forgot").permitAll()
                    .requestMatchers(HttpMethod.POST, "/password/reset").permitAll()
                    .requestMatchers(HttpMethod.GET, "/imoveis", "/imoveis/**").permitAll()
                    .requestMatchers(HttpMethod.POST, "/imoveis/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.PUT, "/imoveis/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.DELETE, "/imoveis/**").hasRole("ADMIN")
                    .requestMatchers(HttpMethod.GET, "/corretores/{id}").permitAll()
                    .requestMatchers(HttpMethod.GET, "/corretores/perfil").hasRole("CORRETOR")
                    .requestMatchers(HttpMethod.PUT, "/corretores/perfil").hasRole("CORRETOR")
                    .requestMatchers(HttpMethod.GET, "/clientes/perfil").hasRole("USER")
                    .requestMatchers(HttpMethod.PUT, "/clientes/perfil").hasRole("USER")
                        .requestMatchers("/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/").hasRole("CORRETOR")
                        .requestMatchers(HttpMethod.POST, "/").hasRole("CORRETOR")
                        .requestMatchers(HttpMethod.DELETE, "/").hasRole("CORRETOR")
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers
                        .frameOptions(frame -> frame.deny())
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
                        .referrerPolicy(referrer -> referrer.policy(
                                org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN
                        ))
                )
                .addFilterBefore((Filter) securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control", "X-Requested-With"));
        configuration.setExposedHeaders(List.of("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}

