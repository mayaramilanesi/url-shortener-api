# URL Shortener API

A scalable, RESTful URL shortening service built with NestJS and TypeScript.  
Anyone can shorten a URL to a 6-character code; authenticated users can manage (list, update, delete) their own links, track click counts, and soft-delete records.

---

## 🚀 Features

- **Anonymous shorten**: `POST /shorten` accepts any URL and returns a 6-character short code.
- **Redirect & count**: `GET /:code` redirects to the original URL and increments its click counter.
- **User accounts & JWT auth**
  - **Register**: `POST /auth/signup`
  - **Login**: `POST /auth/login` → returns `{ accessToken }`
- **Per-user URL management** (requires `Authorization: Bearer <JWT>`)
  - **List**: `GET /urls` → includes click counts
  - **Update**: `PATCH /urls/:id` → change the target URL
  - **Delete**: `DELETE /urls/:id` → soft-delete (logical delete)
- **Audit fields**: `createdAt`, `updatedAt`, `deletedAt` on every record
- **Health check**: `GET /` returns `{ status: 'ok', timestamp }`
- **API Documentation**: Complete Swagger/OpenAPI documentation with interactive testing

---

## 📖 API Documentation

This project includes comprehensive API documentation powered by Swagger/OpenAPI:

### 🔗 Access Documentation

- **Interactive Swagger UI**: `http://localhost:8080/docs`
  - Test all endpoints directly in your browser
  - Built-in JWT authentication
  - Real-time request/response examples
- **HTML Documentation**: `http://localhost:8080/readme`
  - Beautiful, responsive documentation page
  - Complete API guide for beginners
  - Mobile-friendly interface

### ✨ Documentation Features

- **Complete endpoint coverage** with detailed descriptions
- **Request/response examples** in multiple formats
- **Authentication flows** with JWT token management
- **Error handling** documentation with status codes
- **Data model schemas** with validation rules
- **Interactive testing** directly from the browser

---

## 🛠️ Tech Stack

- NestJS v11 + TypeScript
- Node.js >=20.x (locked in `package.json` engines)
- PostgreSQL 15 via TypeORM
- JWT for authentication
- Swagger/OpenAPI for API documentation
- dotenv for environment configuration
- Docker & Docker Compose for local development

---

## 🧪 Testing

Esta API conta com uma suíte completa de testes automatizados, garantindo qualidade e confiabilidade do código.

### 📊 **Cobertura Atual dos Testes**

- ✅ **75 testes** passando (46 unitários + 29 e2e)
- 📈 **67.53% cobertura** de statements
- 🎯 **76.47% cobertura** de funções
- 🏆 **100% cobertura** nos services principais

### 🔧 **Comandos Disponíveis**

```bash
# Testes Unitários
npm run test:unit          # Executa apenas testes unitários
npm run test:unit:watch    # Modo watch para desenvolvimento

# Testes E2E (End-to-End)
npm run test:e2e           # Executa testes de integração completos

# Todos os Testes
npm run test:all           # Executa unitários + e2e em sequência
npm run test:ci            # Para CI/CD (sem watch, com coverage)

# Relatórios de Cobertura
npm run test:cov           # Relatório no terminal
npm run test:cov:html      # Gera relatório HTML interativo
npm run test:cov:unit      # Cobertura apenas dos testes unitários
npm run test:cov:e2e       # Cobertura apenas dos testes e2e

# Abrir relatório HTML no navegador
open coverage/index.html   # macOS
```

### 📁 **Estrutura dos Testes**

```
test/
├── app.e2e-spec.ts           # Testes e2e completos
├── jest-e2e.json             # Configuração Jest e2e
├── setup.ts                  # Setup global para testes
├── test-app.module.ts        # Módulo da aplicação para testes
└── test-database.module.ts   # Configuração banco SQLite

src/
├── **/*.spec.ts              # Testes unitários ao lado do código
├── auth/auth.service.spec.ts  # Testes do AuthService
├── users/users.service.spec.ts # Testes do UsersService
└── urls/urls.service.spec.ts   # Testes do UrlsService
```

### 🎯 **O que está sendo testado**

#### **Testes Unitários (46 testes)**

- ✅ **UrlsService**: Encurtamento, redirecionamento, CRUD de URLs
- ✅ **AuthService**: Signup, login, validação JWT
- ✅ **UsersService**: Criação e busca de usuários
- ✅ **Controllers**: Validação de chamadas e parâmetros

#### **Testes E2E (29 testes)**

- 🏥 **Health Check**: Endpoint de saúde da API
- 📖 **Documentação**: Swagger UI e páginas HTML
- 🔐 **Autenticação**: Fluxos completos de signup/login
- ✂️ **Encurtamento**: URLs anônimas e autenticadas
- 📋 **Gerenciamento**: CRUD completo de URLs
- 🔗 **Redirecionamento**: Funcionamento e contagem de cliques
- ⚠️ **Tratamento de Erros**: Validações e casos limite

### 📊 **Interpretando o Relatório de Cobertura**

O relatório HTML (`coverage/index.html`) mostra:

- 🟢 **Linhas Verdes**: Código coberto pelos testes
- 🔴 **Linhas Vermelhas**: Código não testado
- 🟡 **Linhas Amarelas**: Código parcialmente testado

**Métricas principais:**

- **Statements**: Porcentagem de linhas executadas
- **Branches**: Porcentagem de condicionais testadas (if/else)
- **Functions**: Porcentagem de funções chamadas
- **Lines**: Porcentagem de linhas físicas cobertas

### 🚀 **Executando Testes Durante Desenvolvimento**

```bash
# Para desenvolvimento ativo
npm run test:unit:watch    # Reexecuta testes quando arquivos mudam

# Para validação completa
npm run test:all           # Roda tudo antes de commit

# Para debugging
npm run test:unit -- --verbose  # Mais detalhes dos testes
```

### 🔄 **CI/CD**

Os testes são executados automaticamente em:

- **Push/PR**: Testes unitários e e2e
- **Coverage check**: Verifica se cobertura atende aos thresholds
- **Ambiente isolado**: Cada teste usa banco SQLite in-memory

### 🤝 **Contribuindo com Testes**

1. **Novos features**: Sempre incluir testes unitários
2. **Bug fixes**: Adicionar teste que reproduz o bug
3. **Controllers**: Testes unitários para validação de chamadas
4. **Services**: Testes abrangentes com mocks adequados
5. **E2E**: Para fluxos completos de usuário

**Convenções:**

- Arquivos de teste: `*.spec.ts` (unitários) e `*.e2e-spec.ts` (e2e)
- Mocks: Use Jest mocks para dependências externas
- Cleanup: Sempre limpe dados de teste (especialmente e2e)

---

## 📦 Docker Compose

Prerequisites: Docker & Docker Compose installed.

1. Copy the environment template
   ```bash
   cp .env.example .env
   ```
   Then edit `.env`, replacing placeholders:
   ```dotenv
   POSTGRES_USER=<YOUR_DB_USER>
   POSTGRES_PASSWORD=<YOUR_DB_PASSWORD>
   POSTGRES_DB=<YOUR_DB_NAME>
   DATABASE_URL=postgres://<YOUR_DB_USER>:<YOUR_DB_PASSWORD>@db:5432/<YOUR_DB_NAME>
   PORT=8080
   BASE_URL=http://localhost:8080
   JWT_SECRET=<YOUR_JWT_SECRET>
   JWT_EXPIRES_IN=3600s
   ```
2. Bring up the stack
   ```bash
   docker-compose up --build
   ```
3. The API will be available at `http://localhost:8080`.
   - **📖 Documentation**:
     - Swagger UI: `http://localhost:8080/docs`
     - HTML Guide: `http://localhost:8080/readme`
   - **🏥 Health**: `GET /`
   - **✂️ Core Features**:
     - Shorten: `POST /shorten`
     - Redirect: `GET /:code`
   - **🔐 Authentication**: `POST /auth/signup`, `POST /auth/login`
   - **📋 URL Management** (auth required): `GET /urls`, `PATCH /urls/:id`, `DELETE /urls/:id`

---

## 📥 Running Locally (dev mode)

1. Ensure Node.js v20.x installed.
2. Copy `.env.example` → `.env` and fill in values.
3. Install dependencies
   ```bash
   npm install
   ```
4. Start PostgreSQL (Docker)
   ```bash
   docker-compose up -d db
   ```
5. Run in watch mode
   ```bash
   npm run start:dev
   ```
6. Build and run
   ```bash
   npm run build
   npm run start
   ```

---

## 📄 API Overview

| Method | Path           | Description                                             | Auth required |
| ------ | -------------- | ------------------------------------------------------- | ------------- |
| GET    | `/`            | Health check                                            | No            |
| GET    | `/docs`        | 📖 Interactive Swagger UI documentation                 | No            |
| GET    | `/readme`      | 📄 HTML documentation page                              | No            |
| POST   | `/shorten`     | Shorten a URL (body: `{ url: string }`)                 | No            |
| GET    | `/:code`       | Redirect to original URL and increment click count      | No            |
| POST   | `/auth/signup` | Register new user (body: `{ email, password }`)         | No            |
| POST   | `/auth/login`  | Login (body: `{ email, password }`) → `{ accessToken }` | No            |
| GET    | `/urls`        | List all your shortened URLs                            | Yes           |
| PATCH  | `/urls/:id`    | Update a shortened URL’s target                         | Yes           |
| DELETE | `/urls/:id`    | Soft-delete a shortened URL                             | Yes           |

---

## 📁 Project Structure

```
.
├── src/
│   ├── auth/
│   │   ├── *.spec.ts              # Testes unitários
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── docs/
│   │   ├── docs.controller.ts
│   │   └── docs.module.ts
│   ├── users/
│   │   ├── *.spec.ts              # Testes unitários
│   │   ├── users.service.ts
│   │   └── entities/
│   ├── urls/
│   │   ├── *.spec.ts              # Testes unitários
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── redirect.controller.ts
│   │   ├── shorten.controller.ts
│   │   ├── urls.controller.ts
│   │   └── urls.service.ts
│   ├── utils/
│   │   └── nanoid.util.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   └── main.ts
├── test/
│   ├── app.e2e-spec.ts           # Testes e2e completos
│   ├── jest-e2e.json             # Config Jest e2e
│   ├── setup.ts                  # Setup global
│   ├── test-app.module.ts        # Módulo para testes
│   └── test-database.module.ts   # Config banco SQLite
├── coverage/                     # Relatórios de cobertura
│   └── index.html               # Relatório HTML interativo
├── jest.config.ts               # Configuração Jest principal
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
├── SWAGGER_DOCUMENTATION.md
└── README.md
```

---

## 📜 Commit & Release Guidelines

We follow **Conventional Commits**:

- `feat:` for new features
- `fix:` for bug fixes
- `chore:` for maintenance or build changes
- `docs:` for documentation only
- `test:` for adding/fixing tests
- `refactor:` for code changes that neither fix a bug nor add a feature

Release tags:

- `v0.1.0` — basic shortener endpoint
- `v0.2.0` — authentication implemented
- `v0.3.0` — per-user URL management
- `v0.4.0` — complete Swagger/OpenAPI documentation

---

## 📚 Contributing to Documentation

The API documentation is automatically generated from code annotations. To update documentation:

1. Update Swagger decorators in controllers (`@ApiOperation`, `@ApiResponse`, etc.)
2. Update DTOs with `@ApiProperty` annotations
3. Modify `SWAGGER_DOCUMENTATION.md` for additional guidance
4. The documentation will be automatically updated when the application restarts

---

## 📄 License

Licensed under the MIT License. See LICENSE for details.
