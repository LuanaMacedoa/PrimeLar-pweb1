package com.primelar.backend.controller;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.primelar.backend.config.security.TokenService;
import com.primelar.backend.model.dto.auth.ForgotPasswordRequest;
import com.primelar.backend.model.dto.auth.ResetPasswordRequest;
import com.primelar.backend.model.dto.request.LoginRequest;
import com.primelar.backend.model.dto.request.RegisterRequest;
import com.primelar.backend.model.dto.response.LoginResponse;
import com.primelar.backend.model.dto.response.RegisterResponse;
import com.primelar.backend.model.entity.Role;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.model.enums.UserRole;
import com.primelar.backend.repository.RoleRepository;

import com.primelar.backend.repository.UserRepository;
import com.primelar.backend.service.ClienteProfileService;
import com.primelar.backend.service.PasswordResetService;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetService passwordResetService;
    private final ClienteProfileService clienteProfileService;

    public AuthController(
        AuthenticationManager authenticationManager,
        TokenService tokenService,
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder,
        PasswordResetService passwordResetService,
        ClienteProfileService clienteProfileService
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
        this.clienteProfileService = clienteProfileService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest dados) {
        var credenciais = new UsernamePasswordAuthenticationToken(
            dados.getEmail(), dados.getPassword()
        );
        var auth = authenticationManager.authenticate(credenciais);
        User user = (User) auth.getPrincipal();

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new BadCredentialsException("Conta desativada. Entre em contato com o suporte.");
        }

        Instant expiresAt = tokenService.expiresAt();
        String token = tokenService.generateToken(user);
        Set<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toSet());

        return ResponseEntity.ok(new LoginResponse(
            user.getId(),
            user.getFirstname(),
            user.getEmail(),
            roles,
            token,
            expiresAt
        ));
    }

    @Transactional
    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody @Valid RegisterRequest dados) {
        if (userRepository.findByEmail(dados.getEmail()).isPresent()) {
            throw new IllegalArgumentException("E-mail já cadastrado.");
        }

        User novoUsuario = new User();
        novoUsuario.setFirstname(dados.getFirstname());
        novoUsuario.setLastname(dados.getLastname());
        novoUsuario.setEmail(dados.getEmail());
        novoUsuario.setPassword(passwordEncoder.encode(dados.getPassword()));
        novoUsuario.setCreatedAd(LocalDateTime.now());
        novoUsuario.setActive(true);

        Role userRole = roleRepository.findByName(UserRole.USER.name())
            .orElseThrow(() -> new RuntimeException("Role USER não encontrada."));
        novoUsuario.setRoles(new java.util.HashSet<>(java.util.Set.of(userRole)));

        userRepository.save(novoUsuario);

        clienteProfileService.criarPerfilVazio(novoUsuario);

        Instant expiresAt = tokenService.expiresAt();
        String token = tokenService.generateToken(novoUsuario);
        Set<String> roles = novoUsuario.getRoles().stream().map(Role::getName).collect(Collectors.toSet());

        return ResponseEntity.status(HttpStatus.CREATED).body(new RegisterResponse(
            novoUsuario.getId(),
            novoUsuario.getFirstname(),
            novoUsuario.getEmail(),
            roles,
            token,
            expiresAt
        ));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        try {
            passwordResetService.solicitarReset(request.email());
        } catch (Exception ignored) {
            // Mesmo se o e-mail não existir, retornamos a mesma mensagem
        }
        return ResponseEntity.ok("Se o e-mail estiver cadastrado, você receberá um link em breve.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordResetService.confirmarReset(request.token(), request.novaSenha());
        return ResponseEntity.ok("Senha redefinida com sucesso!");
    }
}
