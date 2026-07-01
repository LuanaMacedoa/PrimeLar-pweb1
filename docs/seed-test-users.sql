-- =============================================================================
-- SEED DE USUÁRIOS PARA DESENVOLVIMENTO / TESTES
-- Execute manualmente no banco: psql -h localhost -p 5433 -U primelar -d primelar
-- Senhas geradas com BCrypt(compatível com Spring BCryptPasswordEncoder)
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
    (true, NOW(), 'maria@primelar.com',   'Maria',   'Souza',    '$2a$10$lokD42libr3hGhGYcg9XeurVUnds5nilbFJsebYCKp9VIZqNd7GAa'),
    (true, NOW(), 'carlos@primelar.com',  'Carlos',  'Lima',     '$2a$10$MM639QS4noGLjYhel2QtxepTnyFsrc23VOXc9389svisdwtryXDTG'),
    (true, NOW(), 'ana@primelar.com',     'Ana',     'Costa',    '$2a$10$woVer/ZKuDHEB3GlBXoE..IdyHxPbkhjlROz690U.P2daWziul/GW'),
    (true, NOW(), 'roberto@primelar.com', 'Roberto', 'Dias',     '$2a$10$32tTpcFEzcWD5DR/4bPLv.OLn9Hq7RnEjZtyXrUKKg5AvTSZcbFw.'),
    (true, NOW(), 'admin@primelar.com',   'Admin',   'PrimeLar', '$2a$10$.ShbxPaTIM6LIRm28Ky1w.puo.yxiJXazeNt/i9kqeBWyUYuJr.Tm');

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