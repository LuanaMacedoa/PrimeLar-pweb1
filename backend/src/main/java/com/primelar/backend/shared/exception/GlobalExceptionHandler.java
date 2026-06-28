package com.primelar.backend.shared.exception;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<StandardError> handleAccessDenied(AccessDeniedException e, HttpServletRequest request) {
        HttpStatus status = HttpStatus.FORBIDDEN;
        StandardError err = StandardError.builder()
                .timestamp(Instant.now())
                .status(status.value())
                .error("Acesso Negado")
                .message("Acesso negado: " + e.getMessage())
                .path(request.getRequestURI())
                .build();

        return ResponseEntity.status(status).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<StandardError> handleGenericException(Exception e, HttpServletRequest request) {
        log.error("Exceção não tratada capturada pelo manipulador global: ", e);
        
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
