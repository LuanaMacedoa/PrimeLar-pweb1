-- ══════════════════════════════════════════════════════
-- Indices de performance declarados nas entidades JPA
-- mas ausentes no schema inicial
-- ══════════════════════════════════════════════════════

-- favoritos
CREATE INDEX IF NOT EXISTS idx_favoritos_user_id   ON favoritos(user_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_imovel_id ON favoritos(imovel_id);

-- imoveis (filtros mais comuns de busca)
CREATE INDEX IF NOT EXISTS idx_imovel_cidade        ON imoveis(cidade);
CREATE INDEX IF NOT EXISTS idx_imovel_bairro        ON imoveis(bairro);
CREATE INDEX IF NOT EXISTS idx_imovel_preco         ON imoveis(preco);
CREATE INDEX IF NOT EXISTS idx_imovel_cidade_bairro ON imoveis(cidade, bairro);

-- password_reset_tokens (lookup por usuario + limpeza por expiracao)
CREATE INDEX IF NOT EXISTS idx_prt_user_id    ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_prt_expires_at ON password_reset_tokens(expires_at);

-- token_revogado (limpeza de tokens expirados)
CREATE INDEX IF NOT EXISTS idx_token_revogado_expiracao ON token_revogado(data_expiracao);

-- ══════════════════════════════════════════════════════
-- NOT NULL nos FKs de favoritos (entidade tem nullable=false
-- mas V1 criou as colunas sem restricao)
-- ══════════════════════════════════════════════════════
ALTER TABLE favoritos ALTER COLUMN user_id   SET NOT NULL;
ALTER TABLE favoritos ALTER COLUMN imovel_id SET NOT NULL;

-- ══════════════════════════════════════════════════════
-- ON DELETE CASCADE nas FKs onde faz sentido:
-- deletar usuario remove seus favoritos e tokens de reset
-- ══════════════════════════════════════════════════════
ALTER TABLE password_reset_tokens
    DROP CONSTRAINT IF EXISTS fk_prt_user,
    ADD  CONSTRAINT fk_prt_user
         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE favoritos
    DROP CONSTRAINT IF EXISTS fk_favorito_user,
    ADD  CONSTRAINT fk_favorito_user
         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE favoritos
    DROP CONSTRAINT IF EXISTS fk_favorito_imovel,
    ADD  CONSTRAINT fk_favorito_imovel
         FOREIGN KEY (imovel_id) REFERENCES imoveis(id) ON DELETE CASCADE;
