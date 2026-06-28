# Primelar - Backlog de Tasks com Dependencias

## Como ler este backlog

- Cada funcionalidade agrupa tasks relacionadas.
- Cada task tem um objetivo, uma descricao curta e uma dependencia.
- Dependencia igual a nenhuma quer dizer que a task pode começar sozinha.
- Cada task tem uma linha de classificacao com apenas tres opcoes: PWEB, PWEB | seguranca de dados, ou seguranca de dados.
- A seguranca aparece em todas as frentes.
- O backlog cobre Spring Boot, JPA, API REST, CRUD, dois modulos e integracao Angular com o backend.

## Requisitos cobertos

- Spring Boot: Epicos 1, 4, 5 e 10.
- JPA e persistencia: Epico 4.
- API REST com GET, GET por ID, POST, PUT ou PATCH e DELETE: Epico 5.
- Dois modulos, um para cadastro e outro para consulta: Epicos 7 e 9, com apoio do Epico 8.
- Angular integrado ao backend: Epico 6.

## Epico 1 - Fundacao da plataforma

### Funcionalidade 1.1 - Base tecnica

- Task T1.1.1
  - Objetivo: criar a base inicial do backend.
  - Descricao: iniciar o projeto Spring Boot com Maven, profiles e estrutura simples para crescer depois.
  - Classificacao: PWEB.
  - Dependencia: nenhuma.
- Task T1.1.2
  - Objetivo: organizar os pacotes do backend.
  - Descricao: separar a camada de inicializacao do backend, api, application, domain, infrastructure, persistence e shared.
  - Classificacao: PWEB.
  - Dependencia: T1.1.1.
- Task T1.1.3
  - Objetivo: preparar o frontend para consumir a API.
  - Descricao: configurar o Angular para usar environment e apontar para a API REST.
  - Classificacao: PWEB.
  - Dependencia: T1.1.1.

### Funcionalidade 1.2 - Observabilidade basica

- Task T1.2.1
  - Objetivo: registrar eventos tecnicos da aplicacao.
  - Descricao: configurar logging estruturado e correlacao de requisicoes.
  - Classificacao: seguranca de dados.
  - Dependencia: T1.1.1.
- Task T1.2.2
  - Objetivo: padronizar falhas de forma segura.
  - Descricao: criar tratamento global de excecoes com resposta simples e consistente.
  - Classificacao: seguranca de dados.
  - Dependencia: T1.1.1.

## Epico 2 - Seguranca e autenticacao

### Funcionalidade 2.1 - Login e logout

- Task T2.1.1
  - Objetivo: autenticar o usuario com seguranca.
  - Descricao: implementar endpoint de login com validacao, emissao de JWT e retorno do perfil.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T1.1.1, T1.1.2, T4.1.1.
- Task T2.1.2
  - Objetivo: encerrar a sessao com controle.
  - Descricao: implementar logout com invalidacao de token ou solucao equivalente.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T2.1.1.

### Funcionalidade 2.2 - Recuperacao de senha planejada

- Task T2.2.1
  - Objetivo: desenhar o fluxo de recuperacao de acesso.
  - Descricao: modelar a solicitacao de redefinicao de senha e a confirmacao.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.1.1.
- Task T2.2.2
  - Objetivo: guardar tokens temporarios com seguranca.
  - Descricao: criar entidade e tabela para token de recuperacao de senha.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.1.1, T4.3.1.

### Funcionalidade 2.3 - Protecao de credenciais

- Task T2.3.1
  - Objetivo: proteger as senhas armazenadas.
  - Descricao: migrar o armazenamento para BCrypt e remover texto puro.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.1.1.
- Task T2.3.2
  - Objetivo: eliminar validacao insegura no frontend.
  - Descricao: remover qualquer comparacao de senha no Angular.
  - Classificacao: seguranca de dados.
  - Dependencia: T2.1.1, T6.1.1.

## Epico 3 - Autorizacao e acesso

### Funcionalidade 3.1 - RBAC

- Task T3.1.1
  - Objetivo: definir papeis e permissoes.
  - Descricao: criar a base de roles e permissions para controlar o acesso.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.1.1.
- Task T3.1.2
  - Objetivo: aplicar acesso por perfil.
  - Descricao: configurar autorizacao por endpoint e por regra de negocio.
  - Classificacao: seguranca de dados.
  - Dependencia: T3.1.1, T2.1.1.

### Funcionalidade 3.2 - Protecao contra acesso indevido

- Task T3.2.1
  - Objetivo: evitar acesso a dados de terceiros.
  - Descricao: impedir Broken Access Control e IDOR com checagem de propriedade e escopo.
  - Classificacao: seguranca de dados.
  - Dependencia: T3.1.2.
- Task T3.2.2
  - Objetivo: validar entrada antes do processamento.
  - Descricao: aplicar validacoes em todos os endpoints sensiveis.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.4.1, T4.4.2.

## Epico 4 - Modelo de dados

### Funcionalidade 4.1 - Usuarios e perfis

- Task T4.1.1
  - Objetivo: criar o nucleo de acesso do sistema.
  - Descricao: modelar usuario, role, permission e seus relacionamentos.
  - Classificacao: PWEB.
  - Dependencia: T1.1.1.
- Task T4.1.2
  - Objetivo: representar os perfis de negocio.
  - Descricao: modelar cliente e corretor como perfis ou ligacoes do usuario.
  - Classificacao: PWEB.
  - Dependencia: T4.1.1.

### Funcionalidade 4.2 - Operacao imobiliaria

- Task T4.2.1
  - Objetivo: representar os dados do negocio imobiliario.
  - Descricao: criar entidades de imovel, lead, visita, proposta e favorito.
  - Classificacao: PWEB.
  - Dependencia: T4.1.1.
- Task T4.2.2
  - Objetivo: registrar rastreabilidade e notificacoes.
  - Descricao: criar entidades de auditoria, notificacao e logs.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.1.1.

### Funcionalidade 4.3 - Persistencia

- Task T4.3.1
  - Objetivo: garantir a integridade do banco.
  - Descricao: definir chaves estrangeiras, indices e restricoes de integridade.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T4.1.1, T4.2.1.
- Task T4.3.2
  - Objetivo: controlar a evolucao do schema.
  - Descricao: criar migracoes e versionamento da base.
  - Classificacao: PWEB.
  - Dependencia: T4.3.1.

### Funcionalidade 4.4 - Validacao de entrada

- Task T4.4.1
  - Objetivo: separar contrato de entrada e saida.
  - Descricao: definir DTOs de request e response para os recursos centrais.
  - Classificacao: PWEB.
  - Dependencia: T4.1.1, T4.2.1.
- Task T4.4.2
  - Objetivo: validar os dados recebidos.
  - Descricao: aplicar Bean Validation nos DTOs.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T4.4.1.

## Epico 5 - API REST core

### Funcionalidade 5.1 - CRUD completo

- Task T5.1.1
  - Objetivo: expor operacoes de usuario.
  - Descricao: criar GET, GET por ID, POST, PUT/PATCH e DELETE para usuarios.
  - Classificacao: PWEB.
  - Dependencia: T4.1.1, T4.4.1, T4.3.1.
- Task T5.1.2
  - Objetivo: expor operacoes dos demais dominios.
  - Descricao: criar os mesmos contratos para imoveis, clientes, corretores, leads, visitas, propostas e favoritos.
  - Classificacao: PWEB.
  - Dependencia: T4.2.1, T4.4.1, T4.3.1.

### Funcionalidade 5.2 - Consultas

- Task T5.2.1
  - Objetivo: melhorar busca e listagem.
  - Descricao: implementar filtros, paginacao e ordenacao.
  - Classificacao: PWEB.
  - Dependencia: T5.1.1.
- Task T5.2.2
  - Objetivo: separar uso administrativo e consulta publica.
  - Descricao: separar endpoints de consulta publica e administrativa.
  - Classificacao: PWEB.
  - Dependencia: T3.1.2, T5.1.1.

## Epico 6 - Integracao Angular

### Funcionalidade 6.1 - Consumo autenticado

- Task T6.1.1
  - Objetivo: centralizar o acesso ao backend.
  - Descricao: criar services Angular tipados para cada recurso da API.
  - Classificacao: PWEB.
  - Dependencia: T5.1.1, T5.1.2.
- Task T6.1.2
  - Objetivo: tratar autenticacao no cliente.
  - Descricao: criar interceptor para JWT, erros e refresh de sessao.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T2.1.1, T2.1.2.

### Funcionalidade 6.2 - Navegacao protegida

- Task T6.2.1
  - Objetivo: proteger rotas por perfil.
  - Descricao: criar guards por autenticacao e por role.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T2.1.1, T3.1.2.
- Task T6.2.2
  - Objetivo: organizar a aplicacao em areas.
  - Descricao: organizar rotas lazy-loaded por area funcional.
  - Classificacao: PWEB.
  - Dependencia: T6.2.1.

### Funcionalidade 6.3 - Formularios

- Task T6.3.1
  - Objetivo: modernizar a entrada de dados.
  - Descricao: migrar telas de cadastro e edicao para Reactive Forms.
  - Classificacao: PWEB.
  - Dependencia: T6.1.1.
- Task T6.3.2
  - Objetivo: padronizar o feedback ao usuario.
  - Descricao: centralizar validacoes e mensagens de erro.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T6.3.1, T4.4.2.

## Epico 7 - Modulo administrativo

### Funcionalidade 7.1 - Dashboard

- Task T7.1.1
  - Objetivo: oferecer uma visao geral ao administrador.
  - Descricao: criar visao geral de metricas e atalhos administrativos.
  - Classificacao: PWEB.
  - Dependencia: T6.2.2, T5.2.1.

### Funcionalidade 7.2 - Usuarios e permissoes

- Task T7.2.1
  - Objetivo: permitir a gestao de usuarios.
  - Descricao: criar tela de listar, cadastrar, editar e remover usuarios.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T5.1.1, T6.3.1.
- Task T7.2.2
  - Objetivo: controlar acessos do sistema.
  - Descricao: criar tela de gestao de roles e permissions.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T3.1.1, T5.1.1.

### Funcionalidade 7.3 - Gestao operacional

- Task T7.3.1
  - Objetivo: administrar os recursos do negocio.
  - Descricao: criar telas de imoveis, corretores, clientes e logs.
  - Classificacao: PWEB.
  - Dependencia: T5.1.2, T5.2.2.
- Task T7.3.2
  - Objetivo: manter configuracoes gerais.
  - Descricao: criar tela de configuracoes gerais.
  - Classificacao: PWEB.
  - Dependencia: T1.1.2.

## Epico 8 - Modulo do corretor

### Funcionalidade 8.1 - Dashboard e perfil

- Task T8.1.1
  - Objetivo: dar visao operacional ao corretor.
  - Descricao: criar dashboard com atividades, leads e propostas.
  - Classificacao: PWEB.
  - Dependencia: T5.2.1, T6.2.2.
- Task T8.1.2
  - Objetivo: permitir a autogestao do corretor.
  - Descricao: criar edicao do proprio perfil e senha.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T5.1.1, T2.3.1.

### Funcionalidade 8.2 - Gestao comercial

- Task T8.2.1
  - Objetivo: operar a carteira de atendimento.
  - Descricao: criar telas para clientes, imoveis, leads e visitas.
  - Classificacao: PWEB.
  - Dependencia: T5.1.2, T6.3.1.
- Task T8.2.2
  - Objetivo: acompanhar as vendas.
  - Descricao: criar fluxo de propostas e acompanhamento de funil.
  - Classificacao: PWEB.
  - Dependencia: T5.1.2, T5.2.1.

## Epico 9 - Modulo do cliente

### Funcionalidade 9.1 - Autoatendimento

- Task T9.1.1
  - Objetivo: permitir a manutencao dos dados pessoais.
  - Descricao: criar perfil, edicao de dados e alteracao de senha.
  - Classificacao: PWEB | seguranca de dados.
  - Dependencia: T5.1.1, T2.3.1.
- Task T9.1.2
  - Objetivo: permitir o acompanhamento do atendimento.
  - Descricao: criar tela de favoritos, propostas e historico de visitas.
  - Classificacao: PWEB.
  - Dependencia: T5.1.2.

### Funcionalidade 9.2 - Navegacao de consulta

- Task T9.2.1
  - Objetivo: permitir a consulta dos imoveis.
  - Descricao: criar listagem e busca de imoveis com filtros.
  - Classificacao: PWEB.
  - Dependencia: T5.2.1, T6.1.1.
- Task T9.2.2
  - Objetivo: detalhar o interesse do cliente.
  - Descricao: criar visao de detalhes do imovel e acoes de interesse.
  - Classificacao: PWEB.
  - Dependencia: T9.2.1.

## Epico 10 - Seguranca avancada e qualidade

### Funcionalidade 10.1 - Hardening

- Task T10.1.1
  - Objetivo: reforcar a seguranca da API.
  - Descricao: configurar CORS, headers de seguranca e preparar para HTTPS.
  - Classificacao: seguranca de dados.
  - Dependencia: T1.1.1, T2.1.1.
- Task T10.1.2
  - Objetivo: evitar vazamento de dados.
  - Descricao: revisar exposicao de informacoes sensiveis e logs.
  - Classificacao: seguranca de dados.
  - Dependencia: T1.2.1, T5.1.1.

### Funcionalidade 10.2 - Validacao e resiliencia

- Task T10.2.1
  - Objetivo: impedir entrada invalida.
  - Descricao: validar entrada com Bean Validation e mensagens padronizadas.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.4.2.
- Task T10.2.2
  - Objetivo: melhorar a resposta a falhas.
  - Descricao: tratar excecoes globais e respostas de erro consistentes.
  - Classificacao: seguranca de dados.
  - Dependencia: T1.2.2.

### Funcionalidade 10.3 - Testes

- Task T10.3.1
  - Objetivo: validar o backend.
  - Descricao: criar testes unitarios e de integracao para o backend.
  - Classificacao: seguranca de dados.
  - Dependencia: T5.1.1, T5.1.2.
- Task T10.3.2
  - Objetivo: validar o frontend.
  - Descricao: criar testes de componentes, services e rotas no Angular.
  - Classificacao: seguranca de dados.
  - Dependencia: T6.2.2, T6.3.1.

## Epico 11 - Deploy e evolucao futura

### Funcionalidade 11.1 - Entrega

- Task T11.1.1
  - Objetivo: preparar a publicacao.
  - Descricao: preparar o build de producao e as variaveis de ambiente.
  - Classificacao: PWEB.
  - Dependencia: T1.1.1, T6.1.1.
- Task T11.1.2
  - Objetivo: documentar a operacao.
  - Descricao: documentar processo de deploy e operacao.
  - Classificacao: PWEB.
  - Dependencia: T11.1.1.

### Funcionalidade 11.2 - Extensibilidade

- Task T11.2.1
  - Objetivo: deixar o sistema pronto para evoluir.
  - Descricao: reservar pontos de extensao para notificacoes, email e integracoes externas.
  - Classificacao: seguranca de dados.
  - Dependencia: T4.2.2.
- Task T11.2.2
  - Objetivo: planejar o futuro da recuperacao de conta.
  - Descricao: definir contrato para futura recuperacao de senha completa e alertas.
  - Classificacao: seguranca de dados.
  - Dependencia: T2.2.1, T2.2.2.
