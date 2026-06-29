package com.primelar.backend.service;

import org.springframework.stereotype.Service;

import com.primelar.backend.repository.UserRepository;

import lombok.Data;

@Service
@Data
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository){
        this.userRepository = userRepository;
    }

    
}
