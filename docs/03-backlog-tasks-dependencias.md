# Primelar - Backlog com Dependencias

## Como ler este backlog

- Cada funcionalidade e um agrupamento de tasks.
- Cada task tem objetivo, breve descricao e dependencia explicita.
- Dependencia igual a nenhuma significa que a task pode iniciar sem outra anterior.
- A seguranca aparece em todas as frentes, nao em uma pessoa so.
- O backlog cobre os requisitos da disciplina de Programacao Web: Spring Boot, JPA, API REST, GET/GET por ID/POST/PUT-PATCH/DELETE, dois modulos e integracao Angular com o backend.

## Requisitos de Programacao Web cobertos por este backlog

- Spring Boot: Epicos 1, 4, 5 e 10.
- Persistencia com JPA: Epico 4.
- API REST com GET, GET por ID, POST, PUT ou PATCH e DELETE: Epico 5.
- Dois modulos, um de cadastramento/remocao e outro de listagem/consulta: Epicos 7 e 9, com apoio do Epico 8.
- Integracao Angular com back-end: Epico 6.

## Epico 1 - Fundacao da plataforma

### Funcionalidade 1.1 - Base tecnica
- T1.1.1
  - Objetivo: criar a base inicial do backend.
  - Descricao: iniciar o projeto Spring Boot com Maven, profiles e estrutura minima para evolucao.
  - Dependencia: nenhuma.
- T1.1.2
  - Objetivo: organizar a arquitetura de pacotes.
  - Descricao: separar bootstrap, api, application, domain, infrastructure, persistence e shared.
  - Dependencia: T1.1.1.
- T1.1.3
  - Objetivo: preparar o frontend para consumir o backend.
  - Descricao: configurar o Angular para usar environment e apontar para a API REST.
  - Dependencia: T1.1.1.

### Funcionalidade 1.2 - Observabilidade basica
- T1.2.1
  - Objetivo: registrar eventos tecnicos da aplicacao.
  - Descricao: preparar logging estruturado e correlacao de requisicoes.
  - Dependencia: T1.1.1.
- T1.2.2
  - Objetivo: padronizar falhas de forma segura.
  - Descricao: criar tratamento global de excecoes com resposta limpa e consistente.
  - Dependencia: T1.1.1.

## Epico 2 - Seguranca e autenticacao

### Funcionalidade 2.1 - Login e logout
- T2.1.1
  - Objetivo: autenticar o usuario com seguranca.
  - Descricao: implementar endpoint de login com validacao, emissao de JWT e retorno do perfil.
  - Dependencia: T1.1.1, T1.1.2, T4.1.1.
- T2.1.2
  - Objetivo: encerrar a sessao com controle.
  - Descricao: implementar logout com invalidacao de token ou estrategia equivalente.
  - Dependencia: T2.1.1.

### Funcionalidade 2.2 - Recuperacao de senha planejada
- T2.2.1
  - Objetivo: desenhar o fluxo de recuperacao de acesso.
  - Descricao: modelar a solicitacao de redefinicao de senha e o fluxo de confirmacao.
  - Dependencia: T4.1.1.
- T2.2.2
  - Objetivo: persistir tokens temporarios com seguranca.
  - Descricao: criar entidade e tabela para token de recuperacao de senha.
  - Dependencia: T4.1.1, T4.3.1.

### Funcionalidade 2.3 - Protecao de credenciais
- T2.3.1
  - Objetivo: proteger senhas armazenadas.
  - Descricao: migrar o armazenamento para BCrypt e remover texto puro.
  - Dependencia: T4.1.1.
- T2.3.2
  - Objetivo: eliminar validacao insegura no frontend.
  - Descricao: remover qualquer comparacao de senha no Angular.
  - Dependencia: T2.1.1, T6.1.1.

## Epico 3 - Autorizacao e acesso

### Funcionalidade 3.1 - RBAC
- T3.1.1
  - Objetivo: definir papeis e permissoes.
  - Descricao: criar a base de roles e permissions para controlar acesso.
  - Dependencia: T4.1.1.
- T3.1.2
  - Objetivo: aplicar acesso por perfil.
  - Descricao: configurar autorizacao por endpoint e por regra de negocio.
  - Dependencia: T3.1.1, T2.1.1.

### Funcionalidade 3.2 - Protecao contra acesso indevido
- T3.2.1
  - Objetivo: evitar acesso a dados de terceiros.
  - Descricao: impedir Broken Access Control e IDOR com checagem de propriedade e escopo.
  - Dependencia: T3.1.2.
- T3.2.2
  - Objetivo: validar entrada antes do processamento.
  - Descricao: aplicar validacoes em todos os endpoints sensiveis.
  - Dependencia: T4.4.1, T4.4.2.

## Epico 4 - Modelo de dados

### Funcionalidade 4.1 - Usuarios e perfis
- T4.1.1
  - Objetivo: criar o nucleo do dominio de acesso.
  - Descricao: modelar usuario, role, permission e seus relacionamentos.
  - Dependencia: T1.1.1.
- T4.1.2
  - Objetivo: representar os perfis de negocio.
  - Descricao: modelar cliente e corretor como perfis ou associacoes do usuario.
  - Dependencia: T4.1.1.

### Funcionalidade 4.2 - Operacao imobiliaria
- T4.2.1
  - Objetivo: representar os dados do negocio imobiliario.
  - Descricao: criar entidades de imovel, lead, visita, proposta e favorito.
  - Dependencia: T4.1.1.
- T4.2.2
  - Objetivo: registrar rastreabilidade e notificacoes.
  - Descricao: criar entidades de auditoria, notificacao e logs.
  - Dependencia: T4.1.1.

### Funcionalidade 4.3 - Persistencia
- T4.3.1
  - Objetivo: garantir integridade do banco.
  - Descricao: definir chaves estrangeiras, indices e restricoes de integridade.
  - Dependencia: T4.1.1, T4.2.1.
- T4.3.2
  - Objetivo: controlar evolucao do schema.
  - Descricao: criar migracoes e versionamento da base.
  - Dependencia: T4.3.1.

### Funcionalidade 4.4 - Validacao de entrada
- T4.4.1
  - Objetivo: separar contrato de entrada e saida.
  - Descricao: definir DTOs de request e response para os recursos centrais.
  - Dependencia: T4.1.1, T4.2.1.
- T4.4.2
  - Objetivo: validar dados recebidos.
  - Descricao: aplicar Bean Validation nos DTOs.
  - Dependencia: T4.4.1.

## Epico 5 - API REST core

### Funcionalidade 5.1 - CRUD completo
- T5.1.1
  - Objetivo: expor operacoes de usuario.
  - Descricao: criar GET, GET por ID, POST, PUT/PATCH e DELETE para usuarios.
  - Dependencia: T4.1.1, T4.4.1, T4.3.1.
- T5.1.2
  - Objetivo: expor operacoes dos demais dominios.
  - Descricao: criar os mesmos contratos para imoveis, clientes, corretores, leads, visitas, propostas e favoritos.
  - Dependencia: T4.2.1, T4.4.1, T4.3.1.

### Funcionalidade 5.2 - Consultas
- T5.2.1
  - Objetivo: melhorar busca e listagem.
  - Descricao: implementar filtros, paginacao e ordenacao.
  - Dependencia: T5.1.1.
- T5.2.2
  - Objetivo: separar uso administrativo e consulta publica.
  - Descricao: separar endpoints de consulta publica e administrativa.
  - Dependencia: T3.1.2, T5.1.1.

## Epico 6 - Integracao Angular

### Funcionalidade 6.1 - Consumo autenticado
- T6.1.1
  - Objetivo: centralizar acesso ao backend.
  - Descricao: criar services Angular tipados para cada recurso da API.
  - Dependencia: T5.1.1, T5.1.2.
- T6.1.2
  - Objetivo: tratar autenticacao no cliente.
  - Descricao: criar interceptor para JWT, erros e refresh de sessao.
  - Dependencia: T2.1.1, T2.1.2.

### Funcionalidade 6.2 - Navegacao protegida
- T6.2.1
  - Objetivo: proteger rotas por perfil.
  - Descricao: criar guards por autenticacao e por role.
  - Dependencia: T2.1.1, T3.1.2.
- T6.2.2
  - Objetivo: organizar a aplicacao em areas.
  - Descricao: organizar rotas lazy-loaded por area funcional.
  - Dependencia: T6.2.1.

### Funcionalidade 6.3 - Formularios
- T6.3.1
  - Objetivo: modernizar entrada de dados.
  - Descricao: migrar telas de cadastro e edicao para Reactive Forms.
  - Dependencia: T6.1.1.
- T6.3.2
  - Objetivo: padronizar feedback ao usuario.
  - Descricao: centralizar validacoes e mensagens de erro.
  - Dependencia: T6.3.1, T4.4.2.

## Epico 7 - Modulo administrativo

### Funcionalidade 7.1 - Dashboard
- T7.1.1
  - Objetivo: oferecer visao geral ao administrador.
  - Descricao: criar visao geral de metricas e atalhos administrativos.
  - Dependencia: T6.2.2, T5.2.1.

### Funcionalidade 7.2 - Usuarios e permissoes
- T7.2.1
  - Objetivo: permitir gestao de usuarios.
  - Descricao: criar tela de listar, cadastrar, editar e remover usuarios.
  - Dependencia: T5.1.1, T6.3.1.
- T7.2.2
  - Objetivo: controlar acessos do sistema.
  - Descricao: criar tela de gestao de roles e permissions.
  - Dependencia: T3.1.1, T5.1.1.

### Funcionalidade 7.3 - Gestao operacional
- T7.3.1
  - Objetivo: administrar os recursos do negocio.
  - Descricao: criar telas de imoveis, corretores, clientes e logs.
  - Dependencia: T5.1.2, T5.2.2.
- T7.3.2
  - Objetivo: manter configuracoes gerais.
  - Descricao: criar tela de configuracoes gerais.
  - Dependencia: T1.1.2.

## Epico 8 - Modulo do corretor

### Funcionalidade 8.1 - Dashboard e perfil
- T8.1.1
  - Objetivo: dar visao operacional ao corretor.
  - Descricao: criar dashboard com atividades, leads e propostas.
  - Dependencia: T5.2.1, T6.2.2.
- T8.1.2
  - Objetivo: permitir autogestao do corretor.
  - Descricao: criar edicao do proprio perfil e senha.
  - Dependencia: T5.1.1, T2.3.1.

### Funcionalidade 8.2 - Gestao comercial
- T8.2.1
  - Objetivo: operar carteira de atendimento.
  - Descricao: criar telas para clientes, imoveis, leads e visitas.
  - Dependencia: T5.1.2, T6.3.1.
- T8.2.2
  - Objetivo: acompanhar vendas.
  - Descricao: criar fluxo de propostas e acompanhamento de funil.
  - Dependencia: T5.1.2, T5.2.1.

## Epico 9 - Modulo do cliente

### Funcionalidade 9.1 - Autoatendimento
- T9.1.1
  - Objetivo: permitir manutencao dos dados pessoais.
  - Descricao: criar perfil, edicao de dados e alteracao de senha.
  - Dependencia: T5.1.1, T2.3.1.
- T9.1.2
  - Objetivo: permitir acompanhamento do atendimento.
  - Descricao: criar tela de favoritos, propostas e historico de visitas.
  - Dependencia: T5.1.2.

### Funcionalidade 9.2 - Navegacao de consulta
- T9.2.1
  - Objetivo: permitir consulta dos imoveis.
  - Descricao: criar listagem e busca de imoveis com filtros.
  - Dependencia: T5.2.1, T6.1.1.
- T9.2.2
  - Objetivo: detalhar o interesse do cliente.
  - Descricao: criar visao de detalhes do imovel e acoes de interesse.
  - Dependencia: T9.2.1.

## Epico 10 - Seguranca avancada e qualidade

### Funcionalidade 10.1 - Hardening
- T10.1.1
  - Objetivo: reforcar a seguranca da API.
  - Descricao: configurar CORS, headers de seguranca e preparacao para HTTPS.
  - Dependencia: T1.1.1, T2.1.1.
- T10.1.2
  - Objetivo: evitar vazamento de dados.
  - Descricao: revisar exposicao de informacoes sensiveis e logs.
  - Dependencia: T1.2.1, T5.1.1.

### Funcionalidade 10.2 - Validacao e resiliencia
- T10.2.1
  - Objetivo: impedir entrada invalida.
  - Descricao: validar entrada com Bean Validation e mensagens padronizadas.
  - Dependencia: T4.4.2.
- T10.2.2
  - Objetivo: melhorar resposta a falhas.
  - Descricao: tratar excecoes globais e respostas de erro consistentes.
  - Dependencia: T1.2.2.

### Funcionalidade 10.3 - Testes
- T10.3.1
  - Objetivo: validar o backend.
  - Descricao: criar testes unitarios e de integracao para backend.
  - Dependencia: T5.1.1, T5.1.2.
- T10.3.2
  - Objetivo: validar o frontend.
  - Descricao: criar testes de componentes, services e rotas no Angular.
  - Dependencia: T6.2.2, T6.3.1.

## Epico 11 - Deploy e evolucao futura

### Funcionalidade 11.1 - Entrega
- T11.1.1
  - Objetivo: preparar a publicacao.
  - Descricao: preparar build de producao e variaveis de ambiente.
  - Dependencia: T1.1.1, T6.1.1.
- T11.1.2
  - Objetivo: documentar a operacao.
  - Descricao: documentar processo de deploy e operacao.
  - Dependencia: T11.1.1.

### Funcionalidade 11.2 - Extensibilidade
- T11.2.1
  - Objetivo: deixar o sistema preparado para evoluir.
  - Descricao: reservar pontos de extensao para notificacoes, email e integracoes externas.
  - Dependencia: T4.2.2.
- T11.2.2
  - Objetivo: planejar o futuro da recuperacao de conta.
  - Descricao: definir contrato para futura recuperacao de senha completa e alertas.
  - Dependencia: T2.2.1, T2.2.2.

## Divisao recomendada para o grupo de 5 pessoas

### Pessoa 1 - Base backend e seguranca central
- Frente principal: T1.1.1, T1.2.1, T1.2.2, T2.1.1, T2.1.2, T2.3.1, T10.1.1, T10.2.2.
- Parte de seguranca: autenticacao, sessao, JWT, BCrypt, CORS, headers e tratamento de erro seguro.

### Pessoa 2 - Dados e API core
- Frente principal: T4.1.1, T4.1.2, T4.2.1, T4.2.2, T4.3.1, T4.3.2, T4.4.1, T4.4.2, T5.1.1, T5.1.2, T5.2.1, T5.2.2.
- Parte de seguranca: validacao de dados, integridade, queries seguras e protecao contra IDOR.

### Pessoa 3 - Angular base e integracao
- Frente principal: T1.1.3, T6.1.1, T6.1.2, T6.2.1, T6.2.2, T6.3.1, T6.3.2.
- Parte de seguranca: guards, interceptors, armazenamento do token, tratamento de erro e controle de acesso por perfil.

### Pessoa 4 - Modulo administrativo e auditoria
- Frente principal: T7.1.1, T7.2.1, T7.2.2, T7.3.1, T7.3.2.
- Parte de seguranca: acesso restrito por role, logs de auditoria e controle de operacoes sensiveis.

### Pessoa 5 - Modulo do corretor, cliente e testes
- Frente principal: T8.1.1, T8.1.2, T8.2.1, T8.2.2, T9.1.1, T9.1.2, T9.2.1, T9.2.2, T10.3.1, T10.3.2, T11.1.1, T11.1.2, T11.2.1, T11.2.2.
- Parte de seguranca: validacoes de formulario, protecao de dados, testes de acesso indevido e cobertura de cenarios sensiveis.

## Regra de autoria para apresentar ao professor

- Cada integrante deve ter tarefa de implementacao e tarefa de seguranca na propria frente.
- A seguranca central nao deve ficar concentrada em uma pessoa.
- Os commits devem mostrar evolucao clara da funcionalidade com protecao aplicada.
- Se possivel, cada pessoa deve conseguir explicar o fluxo completo da sua area: requisicao, regra, persistencia, resposta e seguranca.
