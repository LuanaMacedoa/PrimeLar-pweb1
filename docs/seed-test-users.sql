-- =============================================================================
-- SEED DE USUÁRIOS PARA DESENVOLVIMENTO / TESTES
-- Execute manualmente no banco: psql -h localhost -p 5433 -U primelar -d primelar
-- Senhas geradas com BCrypt custo 10 (compatível com Spring Security)
-- =============================================================================

-- Limpa usuários existentes (CASCADE remove user_roles, profiles, favoritos, tokens)
TRUNCATE TABLE users RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- Usuários
-- -----------------------------------------------------------------------------
-- | # | Nome            | E-mail                | Senha      | Role     |
-- |---|-----------------|-----------------------|------------|----------|
-- | 1 | Maria Souza     | maria@primelar.com    | Senha@123  | USER     |
-- | 2 | Carlos Lima     | carlos@primelar.com   | Senha@123  | USER     |
-- | 3 | Ana Costa       | ana@primelar.com      | Senha@123  | USER     |
-- | 4 | Roberto Dias    | roberto@primelar.com  | Senha@123  | CORRETOR |
-- | 5 | Admin PrimeLar  | admin@primelar.com    | Admin@456  | ADMIN    |
-- -----------------------------------------------------------------------------

INSERT INTO users (active, created_ad, email, firstname, lastname, password_hash) VALUES
    (true, NOW(), 'maria@primelar.com',   'Maria',   'Souza',    '$2b$10$UqMSZCbc2hGwsv2bavmP8O6WH9ktAuDGKICWECkLkzPXAJpdJ6dGq'),
    (true, NOW(), 'carlos@primelar.com',  'Carlos',  'Lima',     '$2b$10$s1xwa6Z4DQnAb1VJUk7zr.2XWEpXE7zWZNl8/ZbKJQ3MRoq28QD36'),
    (true, NOW(), 'ana@primelar.com',     'Ana',     'Costa',    '$2b$10$5PJA/vIOXbCSk2Pw6QUh3e/qaGV7VMMYDNS7E5fxEAUTUE4pZfPXG'),
    (true, NOW(), 'roberto@primelar.com', 'Roberto', 'Dias',     '$2b$10$WroGJvdKlQskbh7pgqlBEuouBdHYrXOo13ZNirVlUh7gq/rMMEj9i'),
    (true, NOW(), 'admin@primelar.com',   'Admin',   'PrimeLar', '$2b$10$YsULVqUteTmAr73IkEGFrugf1tP27v80X6d6X125HNQNYBKz/fKnC');

-- Roles
INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'USER'
WHERE u.email IN ('maria@primelar.com', 'carlos@primelar.com', 'ana@primelar.com');

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'CORRETOR'
WHERE u.email = 'roberto@primelar.com';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id FROM users u JOIN roles r ON r.name = 'ADMIN'
WHERE u.email = 'admin@primelar.com';

-- Perfis de cliente
INSERT INTO cliente_profiles (user_id, telefone, cpf, preferencias)
SELECT u.id, NULL, NULL, NULL FROM users u
WHERE u.email IN ('maria@primelar.com', 'carlos@primelar.com', 'ana@primelar.com');

-- Perfil de corretor
INSERT INTO corretor_profiles (user_id, creci, telefone, bio)
SELECT u.id, 'SP-12345', '(11) 98765-4321', 'Especialista em imóveis residenciais.'
FROM users u WHERE u.email = 'roberto@primelar.com';

-- Consultas gerais
select * from users;
select * from cliente_profiles;
select * from corretor_profiles;
select * from user_roles;