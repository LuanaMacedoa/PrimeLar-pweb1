package com.primelar.backend.controller;

import com.primelar.backend.config.security.TokenService;
import com.primelar.backend.model.dto.auth.ForgotPasswordRequest;
import com.primelar.backend.model.dto.auth.ResetPasswordRequest;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.model.enums.UserRole;
import com.primelar.backend.repository.UserRepository;
import com.primelar.backend.service.PasswordResetService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@SuppressWarnings("hiding")
@RestController
@RequestMapping("/auth")
public class AuthController<ForgotPasswordRequest, ResetPasswordRequest> {

    // Gerencia autenticação (verifica email + senha via Spring Security)
    private final AuthenticationManager authenticationManager;

    // Gera e valida tokens JWT
    private final TokenService tokenService;

    // Acessa o banco de dados de usuários
    private final UserRepository userRepository;

    // Faz o hash da senha (BCrypt)
    private final PasswordEncoder passwordEncoder;

    // Lógica de forgot/reset password
    private final PasswordResetService passwordResetService;

    public AuthController(
        AuthenticationManager authenticationManager,
        TokenService tokenService,
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        PasswordResetService passwordResetService
    ) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid LoginRequest dados) {

        // Cria as credenciais e autentica via Spring Security
        var credenciais = new UsernamePasswordAuthenticationToken(
            dados.email(), dados.password()
        );
        var auth = authenticationManager.authenticate(credenciais);

        // Pega o usuário autenticado
        User user = (User) auth.getPrincipal();

        // Gera os dois tokens
        String accessToken = tokenService.generateToken(user);
        String refreshToken = tokenService.generateRefreshToken(user);

        return ResponseEntity.ok(new LoginResponse(accessToken, refreshToken));
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody @Valid RegisterRequest dados) {

        // Verifica se o e-mail já está em uso
        if (userRepository.findByEmail(dados.email()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("E-mail já cadastrado.");
        }

        // Cria o novo usuário
        User novoUsuario = new User();
        novoUsuario.setName(dados.name());
        novoUsuario.setLastname(dados.lastname());
        novoUsuario.setEmail(dados.email());
        novoUsuario.setPassword(passwordEncoder.encode(dados.password())); // senha com hash
        novoUsuario.setCreatedAd(LocalDateTime.now());
        novoUsuario.setActive(true);
        novoUsuario.setRole(UserRole.USER); // role padrão ao cadastrar

        userRepository.save(novoUsuario);

        return ResponseEntity.status(HttpStatus.CREATED)
            .body("Usuário cadastrado com sucesso.");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody RefreshRequest dados) {

        String email = tokenService.validateToken(dados.refreshToken());

        if (email == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Refresh token inválido ou expirado.");
        }

        // Busca o usuário pelo e-mail extraído do token
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Gera novo access token
        String novoAccessToken = tokenService.generateToken(user);

        return ResponseEntity.ok(new LoginResponse(novoAccessToken, dados.refreshToken()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        // Resposta genérica por segurança (não revela se e-mail existe)
        try {
            passwordResetService.solicitarReset(((LoginRequest) request).email());
        } catch (Exception ignored) {
            // Mesmo se o e-mail não existir, retornamos a mesma mensagem
        }
        return ResponseEntity.ok(
            "Se o e-mail estiver cadastrado, você receberá um link em breve."
        );
    }
    
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody com.primelar.backend.model.dto.auth.ResetPasswordRequest  request) {
        try {
            passwordResetService.confirmarReset(request.token(), request.novaSenha());
            return ResponseEntity.ok("Senha redefinida com sucesso!");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    record LoginRequest(String email, String password) {}

    record RegisterRequest(String name, String lastname, String email, String password) {}

    record RefreshRequest(String refreshToken) {}

    record LoginResponse(String accessToken, String refreshToken) {}
}