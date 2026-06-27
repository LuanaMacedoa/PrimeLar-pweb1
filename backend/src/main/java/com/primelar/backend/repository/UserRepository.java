package com.primelar.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.primelar.backend.model.entity.User;

public interface  UserRepository extends JpaRepository<User, Long>{

}
