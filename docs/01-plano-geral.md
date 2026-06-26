# Primelar - Plano Geral de Evolucao

## 1. Contexto atual

O workspace atual contem apenas o frontend Angular. Nao existe backend Spring Boot neste repositorio. A aplicacao hoje funciona como uma vitrine imobiliaria com uma area de autenticacao simples e consumo direto do Supabase pelo frontend.

## 2. Objetivo do projeto

Evoluir o sistema para uma plataforma completa de gestao imobiliaria, com backend Spring Boot, Spring Data JPA, Spring Security, JWT, persistencia em banco relacional e frontend Angular integrado via API REST.

## 3. Diagnostico arquitetural

### O que existe hoje
- Landing page publica com imoveis, depoimentos, servicos e formulario de contato.
- Area de autenticacao com login e cadastro.
- Servicos Angular acessando Supabase diretamente.
- Estado de usuario apenas em memoria, sem sessao real.
- Sem guards, interceptors, roles, permissions ou controle de acesso por rota.

### Principais problemas
- Senha comparada em texto puro no frontend.
- Credenciais de integracao expostas no codigo.
- Forte acoplamento entre interface e persistencia.
- Ausencia de camadas de dominio, API, DTOs e repositorios no backend.
- Ausencia de separacao clara entre area publica, administrativa, corretor e cliente.

## 4. Arquitetura alvo

### Backend
- Spring Boot como base.
- Spring Data JPA para persistencia.
- Spring Security para autenticacao e autorizacao.
- JWT para sessao stateless com refresh token quando aplicavel.
- BCrypt para senha.
- Bean Validation para entrada.
- Tratamento global de excecoes.
- CORS controlado, headers de seguranca e preparacao para HTTPS.

### Frontend
- Angular com Router, HttpClient, Guards, Interceptors e Reactive Forms.
- Areas lazy-loaded por perfil.
- Separacao entre module administrativo, module do corretor, module do cliente e consultas publicas.
- Servicos tipados e centralizados por dominio.

## 5. Dominio funcional esperado

- Autenticacao: login, logout, recuperacao de senha planejada, controle de sessao.
- Administracao: usuarios, corretores, clientes, imoveis, permissões, logs, configuracoes.
- Corretor: perfil, clientes, imoveis, leads, visitas, propostas, funil de vendas.
- Cliente: perfil, senha, favoritos, propostas, historico de visitas, consulta de imoveis.
- Sistema: auditoria, notificacoes, extensibilidade para futuras integracoes.

## 6. Roadmap resumido

1. Fundacao da plataforma.
2. Seguranca e autenticacao.
3. Autorizacao e acesso.
4. Modelo de dados.
5. API REST core.
6. Integracao Angular.
7. Modulo administrativo.
8. Modulo do corretor.
9. Modulo do cliente.
10. Seguranca avancada e qualidade.
11. Deploy e evolucao futura.

## 7. Riscos principais

- Definicao de roles versus permissions granulares.
- Possivel retrabalho se o modelo de dados nao for fechado antes da API.
- Risco de inconsistencias se frontend e backend forem evoluidos sem contrato REST fixo.

## 8. Decisoes adotadas

- O backend Spring Boot sera criado do zero neste workspace.
- O banco padrao de referencia sera PostgreSQL.
- O Supabase atual sera tratado como estado legado de analise.
- O frontend deve passar a consumir somente a API REST.
- O sistema deve nascer com separacao clara entre administracao e consultas.

## 9. Critério de trabalho para o grupo

- Cada tarefa deve ser pequena e verificavel.
- Dependencias devem ser explicitadas antes de executar a tarefa.
- Sempre que possivel, separar frontend, backend, seguranca, dados e testes.
- Cada commit deve apontar um pedaco claro do backlog.

## 10. Arquivos de referencia

- [package.json](../package.json)
- [angular.json](../angular.json)
- [src/app/app.routes.ts](../src/app/app.routes.ts)
- [src/app/app.config.ts](../src/app/app.config.ts)
- [src/service/auth.service.ts](../src/service/auth.service.ts)
- [src/service/database-service.ts](../src/service/database-service.ts)
- [src/app/components/landing/landing.ts](../src/app/components/landing/landing.ts)
- [src/app/components/auth/auth.component.ts](../src/app/components/auth/auth.component.ts)