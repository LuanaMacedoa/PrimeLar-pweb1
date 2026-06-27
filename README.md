# Primelar

Projeto desenvolvido por Luana, Laura, Vinicius, Gustavo e Luis Eduardo como parte da uniao entre a disciplina de Programacao Web e a disciplina de Seguranca de Dados.

O objetivo e evoluir uma aplicacao de imobiliaria para um sistema de gestao mais completo, com foco em arquitetura organizada, integracao entre front-end e back-end, persistencia de dados, controle de acesso e boas praticas de seguranca desde o inicio.

Este trabalho foi planejado com base em:
- plano geral do projeto
- divisao por epicos
- backlog com tasks e dependencias
- separacao entre areas de administracao, consulta e perfis autenticados

O sistema esta sendo estruturado para atender aos requisitos academicos de API REST, Spring Boot, JPA, integracao com Angular e principios de seguranca aplicados ao desenvolvimento do software.

## Ambiente com Docker (backend + banco)

Pré-requisitos: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) v2+.

### 1. Configurar variáveis de ambiente

```bash
cp .env.example .env

Edite .env e defina POSTGRES_PASSWORD (e demais valores se necessário)

# Rodar em background
docker compose up -d --build

# Ver logs
docker compose logs -f backend

# Parar e remover containers (volume do banco é preservado)
docker compose down

# Parar e apagar dados do banco
docker compose down -v

```
