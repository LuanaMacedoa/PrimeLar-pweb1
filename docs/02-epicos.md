# Primelar - Epicos

## Epico 1 - Fundacao da plataforma
Objetivo: criar a base tecnica para suportar backend, frontend integrado e trabalho em equipe.

Escopo:
- Estrutura inicial do backend Spring Boot.
- Convencoes de pacotes e camadas.
- Configuracao de ambiente e integracao com Angular.
- Logging e tratamento basico de erros.

## Epico 2 - Seguranca e autenticacao
Objetivo: garantir entrada segura no sistema e sessao confiavel.

Escopo:
- Login e logout.
- JWT.
- BCrypt.
- Recuperacao de senha planejada.
- Controle de sessao.

## Epico 3 - Autorizacao e acesso
Objetivo: impedir acesso indevido e estruturar RBAC.

Escopo:
- Roles.
- Permissions.
- Autorizacao por endpoint.
- Protecao contra IDOR e Broken Access Control.

## Epico 4 - Modelo de dados
Objetivo: definir o dominio persistente da plataforma.

Escopo:
- Usuario, role e permission.
- Cliente e corretor.
- Imovel, lead, visita, proposta e favorito.
- Auditoria, notificacao e logs.

## Epico 5 - API REST core
Objetivo: expor os recursos principais com contrato padronizado.

Escopo:
- GET, GET por ID, POST, PUT/PATCH e DELETE.
- Filtros, paginação e ordenacao.
- Separacao entre consultas publicas e administrativas.

## Epico 6 - Integracao Angular
Objetivo: conectar o frontend ao backend com navegacao protegida.

Escopo:
- Services tipados.
- Interceptors.
- Guards.
- Reactive Forms.
- Rotas lazy-loaded por perfil.

## Epico 7 - Modulo administrativo
Objetivo: oferecer gestao central da plataforma.

Escopo:
- Dashboard.
- Usuarios.
- Corretores.
- Clientes.
- Imoveis.
- Permissoes.
- Logs.
- Configuracoes.

## Epico 8 - Modulo do corretor
Objetivo: dar ao corretor autonomia operacional.

Escopo:
- Dashboard.
- Perfil.
- Clientes.
- Imoveis.
- Leads.
- Visitas.
- Propostas.
- Funil de vendas.

## Epico 9 - Modulo do cliente
Objetivo: permitir autoatendimento autenticado.

Escopo:
- Perfil.
- Edicao de dados.
- Alteracao de senha.
- Favoritos.
- Propostas.
- Historico de visitas.
- Consulta de imoveis.

## Epico 10 - Seguranca avancada e qualidade
Objetivo: endurecer o sistema e elevar confiabilidade.

Escopo:
- CORS e headers.
- HTTPS readiness.
- Validacao de entrada.
- Tratamento global de excecoes.
- Testes de backend e frontend.

## Epico 11 - Deploy e evolucao futura
Objetivo: preparar entrega e extensibilidade.

Escopo:
- Build de producao.
- Variaveis de ambiente.
- Documentacao de operacao.
- Pontos de extensao para notificacoes e integracoes.