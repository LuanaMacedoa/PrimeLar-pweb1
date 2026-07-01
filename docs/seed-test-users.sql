-- =============================================================================
-- SEED DE USUÁRIOS E IMÓVEIS PARA DESENVOLVIMENTO / TESTES
-- Execute manualmente no banco: psql -h localhost -p 5433 -U primelar -d primelar
-- Senhas geradas com BCrypt(compatível com Spring BCryptPasswordEncoder)
-- =============================================================================

-- Limpa dados existentes (CASCADE remove favoritos, profiles, tokens, etc.)
TRUNCATE TABLE imoveis RESTART IDENTITY CASCADE;
TRUNCATE TABLE users  RESTART IDENTITY CASCADE;

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

-- -----------------------------------------------------------------------------
-- Imóveis de exemplo
-- -----------------------------------------------------------------------------
INSERT INTO imoveis (titulo, descricao, preco, cidade, bairro, endereco, quartos, banheiros, vagas, caminho_imagem) VALUES
    (
        'Apartamento 3 quartos com varanda gourmet',
        'Apartamento amplo e iluminado com varanda gourmet, piscina e academia no condomínio. Próximo ao metrô Vila Mariana e comércio local.',
        350000.00,
        'São Paulo', 'Vila Mariana',
        'Rua Domingos de Morais, 500, Apto 82',
        3, 2, 1,
        NULL
    ),
    (
        'Casa 4 quartos em condomínio fechado',
        'Casa espaçosa com quintal, churrasqueira e área de lazer completa. Condomínio fechado com portaria 24h e câmeras de segurança.',
        780000.00,
        'Curitiba', 'Batel',
        'Rua Amintas de Barros, 200',
        4, 3, 2,
        NULL
    ),
    (
        'Studio moderno mobiliado no centro',
        'Studio totalmente mobiliado com design contemporâneo e acabamento de alto padrão. Ideal para profissionais. A poucos metros de restaurantes e da estação de metrô.',
        195000.00,
        'Rio de Janeiro', 'Botafogo',
        'Rua São Clemente, 150, Apto 310',
        1, 1, NULL,
        NULL
    );

-- Consultas gerais
select * from users;
select * from imoveis;
select * from cliente_profiles;
select * from corretor_profiles;
select * from roles;
select * from user_roles;
select * from permissions;
select * from role_permissions;