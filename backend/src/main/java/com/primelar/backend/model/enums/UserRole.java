package com.primelar.backend.model.enums;

public enum UserRole {
    USER("usuario"),
    CORRETOR("corretor"),
    ADMIN("administrador");

    private String role;

    UserRole(String role){
        this.role = role;
    }

    public String getRole(){
        return role;
    }
}
