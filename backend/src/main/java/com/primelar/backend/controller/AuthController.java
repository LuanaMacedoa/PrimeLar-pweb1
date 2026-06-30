package com.primelar.backend.controller;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.primelar.backend.config.security.TokenService;
import com.primelar.backend.model.dto.request.LoginRequest;
import com.primelar.backend.model.dto.request.RegisterRequest;
import com.primelar.backend.model.dto.auth.ForgotPasswordRequest;
import com.primelar.backend.model.dto.auth.ResetPasswordRequest;
import com.primelar.backend.model.dto.response.LoginResponse;
import com.primelar.backend.model.dto.response.RegisterResponse;
import com.primelar.backend.model.entity.Role;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.model.enums.UserRole;
import com.primelar.backend.repository.RoleRepository;
import com.primelar.backend.repository.UserRepository;
import com.primelar.backend.service.PasswordResetService;

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

    public AuthController(
        AuthenticationManager authenticationManager,
        TokenService tokenService,
        UserRepository userRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder,
        PasswordResetService passwordResetService
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest dados) {
        var credenciais = new UsernamePasswordAuthenticationToken(
            dados.getEmail(), dados.getPassword()
        );
        var auth = authenticationManager.authenticate(credenciais);
        User user = (User) auth.getPrincipal();
        String token = tokenService.generateToken(user);
        return ResponseEntity.ok(new LoginResponse(user.getFirstname(), token));
    }

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

        UserRole selectedRole = dados.getRole() != null ? dados.getRole() : UserRole.USER;

        Role userRole = roleRepository.findByName(selectedRole.name())
            .orElseThrow(() -> new RuntimeException("Role " + selectedRole.name() + " não encontrada."));
        novoUsuario.setRoles(new java.util.HashSet<>(java.util.Set.of(userRole)));

        userRepository.save(novoUsuario);

        String token = tokenService.generateToken(novoUsuario);
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(new RegisterResponse(novoUsuario.getFirstname(), token));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody @Valid ForgotPasswordRequest request) {
        try {
            passwordResetService.solicitarReset(request.email());
        } catch (Exception ignored) {
            // Mesmo se o e-mail não existir, retornamos a mesma mensagem
        }
        return ResponseEntity.ok(
            "Se o e-mail estiver cadastrado, você receberá um link em breve."
        );
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody @Valid ResetPasswordRequest request) {
        passwordResetService.confirmarReset(request.token(), request.novaSenha());
        return ResponseEntity.ok("Senha redefinida com sucesso!");
    }
}