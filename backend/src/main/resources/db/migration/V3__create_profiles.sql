CREATE TABLE IF NOT EXISTS cliente_profiles (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL UNIQUE,
    telefone    VARCHAR(20),
    cpf         VARCHAR(14) UNIQUE,
    preferencias VARCHAR(255),
    CONSTRAINT fk_cliente_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS corretor_profiles (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL UNIQUE,
    creci       VARCHAR(50) UNIQUE,
    telefone    VARCHAR(20),
    bio         TEXT,
    CONSTRAINT fk_corretor_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
