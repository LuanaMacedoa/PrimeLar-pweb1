INSERT INTO permissions (name) VALUES
    ('IMOVEL_READ'),
    ('IMOVEL_WRITE'),
    ('IMOVEL_DELETE'),
    ('USER_MANAGE')
ON CONFLICT (name) DO NOTHING;

INSERT INTO roles (name) VALUES
    ('USER'),
    ('CORRETOR'),
    ('ADMIN')
ON CONFLICT (name) DO NOTHING;

-- USER: leitura de imóveis
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name = 'IMOVEL_READ'
WHERE r.name = 'USER'
ON CONFLICT DO NOTHING;

-- CORRETOR: leitura e escrita de imóveis
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
JOIN permissions p ON p.name IN ('IMOVEL_READ', 'IMOVEL_WRITE')
WHERE r.name = 'CORRETOR'
ON CONFLICT DO NOTHING;

-- ADMIN: todas as permissões
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r
CROSS JOIN permissions p
WHERE r.name = 'ADMIN'
ON CONFLICT DO NOTHING;
