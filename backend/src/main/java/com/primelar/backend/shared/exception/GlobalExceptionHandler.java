package com.primelar.backend.shared.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<StandardError> handleValidation(MethodArgumentNotValidException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        List<StandardError.FieldError> errors = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> new StandardError.FieldError(err.getField(), err.getDefaultMessage()))
                .collect(Collectors.toList());

        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Erro de Validação")
                .message("A validação falhou para um ou mais campos.")
                .path(request.getRequestURI())
                .errors(errors)
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<StandardError> handleMessageNotReadable(HttpMessageNotReadableException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Corpo da Requisição Inválido")
                .message("O corpo da requisição está ausente ou com formato inválido.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<StandardError> handleEntityNotFound(EntityNotFoundException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Recurso Não Encontrado")
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<StandardError> handleNoResourceFound(NoResourceFoundException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.NOT_FOUND;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Rota Não Encontrada")
                .message("O endpoint solicitado não existe: " + request.getMethod() + " " + request.getRequestURI())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<StandardError> handleMethodNotSupported(HttpRequestMethodNotSupportedException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.METHOD_NOT_ALLOWED;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Método Não Permitido")
                .message("O método " + e.getMethod() + " não é suportado para este endpoint.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<StandardError> handleIllegalArgument(IllegalArgumentException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.BAD_REQUEST;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Requisição Inválida")
                .message(e.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<StandardError> handleDataIntegrity(DataIntegrityViolationException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.CONFLICT;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Conflito de Dados")
                .message("A operação viola uma restrição de integridade do banco de dados.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<StandardError> handleBadCredentials(BadCredentialsException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Credenciais Inválidas")
                .message("E-mail ou senha incorretos.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<StandardError> handleAuthentication(AuthenticationException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Não Autenticado")
                .message("Autenticação necessária para acessar este recurso.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<StandardError> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Acesso Negado")
                .message("Você não tem permissão para acessar este recurso.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> handleGenericException(Exception e, HttpServletRequest request) {
        log.warn("Exceção não tratada: {} - {}", e.getClass().getSimpleName(), e.getMessage());
        log.debug("Stack trace completo:", e);

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Erro Interno do Servidor")
                .message("Ocorreu um erro inesperado no servidor.")
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }
}
