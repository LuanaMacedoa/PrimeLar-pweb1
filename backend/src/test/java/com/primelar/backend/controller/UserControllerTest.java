package com.primelar.backend.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.dto.request.UserRequestDTO;
import com.primelar.backend.model.dto.request.UserUpdateRequestDTO;
import com.primelar.backend.model.dto.response.UserResponseDTO;
import com.primelar.backend.model.entity.User;
import com.primelar.backend.model.enums.UserRole;
import com.primelar.backend.repository.UserRepository;

@SpringBootTest
@Transactional
class UserControllerTest {

    @Autowired
    private UserController userController;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User adminUser;
    private User normalUser;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        adminUser = new User();
        adminUser.setName("Admin");
        adminUser.setLastname("User");
        adminUser.setEmail("admin@primelar.com");
        adminUser.setPassword(passwordEncoder.encode("adminPass123"));
        adminUser.setCreatedAd(LocalDateTime.now());
        adminUser.setActive(true);
        adminUser.setRole(UserRole.ADMIN);
        userRepository.save(adminUser);

        normalUser = new User();
        normalUser.setName("Normal");
        normalUser.setLastname("User");
        normalUser.setEmail("user@primelar.com");
        normalUser.setPassword(passwordEncoder.encode("userPass123"));
        normalUser.setCreatedAd(LocalDateTime.now());
        normalUser.setActive(true);
        normalUser.setRole(UserRole.USER);
        userRepository.save(normalUser);
    }

    @Test
    void shouldCreateUserAndEncryptPassword() {
        UserRequestDTO request = new UserRequestDTO();
        request.setName("New");
        request.setLastname("Corretor");
        request.setEmail("corretor@primelar.com");
        request.setPassword("securePassword123");
        request.setRole(UserRole.CORRETOR);

        ResponseEntity<UserResponseDTO> responseEntity = userController.create(request);
        assertEquals(HttpStatus.CREATED, responseEntity.getStatusCode());

        UserResponseDTO response = responseEntity.getBody();
        assertNotNull(response);
        assertNotNull(response.id());
        assertEquals("New", response.name());
        assertEquals(UserRole.CORRETOR, response.role());

        User createdUser = userRepository.findById(response.id()).orElseThrow();
        assertTrue(passwordEncoder.matches("securePassword123", createdUser.getPassword()));
    }

    @Test
    void shouldGetAllUsers() {
        ResponseEntity<List<UserResponseDTO>> responseEntity = userController.getAll();
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        
        List<UserResponseDTO> users = responseEntity.getBody();
        assertNotNull(users);
        assertTrue(users.size() >= 2);
    }

    @Test
    void shouldUpdateUserAndEncryptNewPassword() {
        UserUpdateRequestDTO request = new UserUpdateRequestDTO();
        request.setName("UpdatedName");
        request.setLastname("UpdatedLastName");
        request.setEmail("user@primelar.com");
        request.setPassword("newSecurePassword123");
        request.setRole(UserRole.USER);
        request.setActive(true);

        ResponseEntity<UserResponseDTO> responseEntity = userController.update(normalUser.getId(), request);
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());

        UserResponseDTO response = responseEntity.getBody();
        assertNotNull(response);
        assertEquals("UpdatedName", response.name());

        User updatedUser = userRepository.findById(normalUser.getId()).orElseThrow();
        assertTrue(passwordEncoder.matches("newSecurePassword123", updatedUser.getPassword()));
    }

    @Test
    void shouldDeleteUser() {
        ResponseEntity<Void> responseEntity = userController.delete(normalUser.getId());
        assertEquals(HttpStatus.NO_CONTENT, responseEntity.getStatusCode());

        assertFalse(userRepository.findById(normalUser.getId()).isPresent());
    }
}
