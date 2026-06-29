package com.primelar.backend.config;

import java.util.Map;
import java.util.Set;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.primelar.backend.model.entity.Permission;
import com.primelar.backend.model.entity.Role;
import com.primelar.backend.repository.PermissionRepository;
import com.primelar.backend.repository.RoleRepository;

@Component
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public DataInitializer(RoleRepository roleRepository, PermissionRepository permissionRepository) {
        this.roleRepository = roleRepository;
        this.permissionRepository = permissionRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        Permission readImovel   = findOrCreate("IMOVEL_READ");
        Permission writeImovel  = findOrCreate("IMOVEL_WRITE");
        Permission deleteImovel = findOrCreate("IMOVEL_DELETE");
        Permission manageUsers  = findOrCreate("USER_MANAGE");

        seedRole("USER",     Set.of(readImovel));
        seedRole("CORRETOR", Set.of(readImovel, writeImovel));
        seedRole("ADMIN",    Set.of(readImovel, writeImovel, deleteImovel, manageUsers));
    }

    private Permission findOrCreate(String name) {
        return permissionRepository.findByName(name)
                .orElseGet(() -> permissionRepository.save(new Permission(null, name, Set.of())));
    }

    private void seedRole(String name, Set<Permission> permissions) {
        if (roleRepository.findByName(name).isEmpty()) {
            Role role = new Role();
            role.setName(name);
            role.setPermissions(permissions);
            roleRepository.save(role);
        }
    }
}
