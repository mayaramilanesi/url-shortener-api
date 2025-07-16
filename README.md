# URL Shortener API

A scalable, RESTful URL shortening service built with NestJS and TypeScript.  
Anyone can shorten a URL to a 6-character code; authenticated users can manage (list, update, delete) their own links, track click counts, and soft-delete records.

## ⚡ Super Quick Start

**Want to run this project instantly? Just one command:**

```bash
make setup
```

**That's it!** 🎉 Your API will be running at `http://localhost:8080` with full documentation at `/docs`.

> **Prerequisites:** Docker & Docker Compose installed. Everything else is automatic!

**Alternative commands:**

- `./quick-start.sh` (bash script)
- `npm run dev:quick` (npm script)

📖 **[See QUICK_START.md for details](QUICK_START.md)**

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

This API features a complete automated testing suite, ensuring code quality and reliability.

### 📊 **Current Test Coverage**

- ✅ **75 tests** passing (46 unit + 29 e2e)
- 📈 **67.53% statement coverage**
- 🎯 **76.47% function coverage**
- 🏆 **100% coverage** on main services

### 🔧 **Available Commands**

```bash
# Unit Tests
npm run test:unit          # Run unit tests only
npm run test:unit:watch    # Watch mode for development

# E2E (End-to-End) Tests
npm run test:e2e           # Run complete integration tests

# All Tests
npm run test:all           # Run unit + e2e in sequence
npm run test:ci            # For CI/CD (no watch, with coverage)

# Coverage Reports
npm run test:cov           # Terminal report
npm run test:cov:html      # Generate interactive HTML report
npm run test:cov:unit      # Coverage for unit tests only
npm run test:cov:e2e       # Coverage for e2e tests only

# Open HTML report in browser
open coverage/index.html   # macOS
```

### 📁 **Test Structure**

```
test/
├── app.e2e-spec.ts           # Complete e2e tests
├── jest-e2e.json             # Jest e2e configuration
├── setup.ts                  # Global test setup
├── test-app.module.ts        # Application module for tests
└── test-database.module.ts   # SQLite database configuration

src/
├── **/*.spec.ts              # Unit tests alongside code
├── auth/auth.service.spec.ts  # AuthService tests
├── users/users.service.spec.ts # UsersService tests
└── urls/urls.service.spec.ts   # UrlsService tests
```

### 🎯 **What's Being Tested**

#### **Unit Tests (46 tests)**

- ✅ **UrlsService**: Shortening, redirection, URL CRUD
- ✅ **AuthService**: Signup, login, JWT validation
- ✅ **UsersService**: User creation and search
- ✅ **Controllers**: Call validation and parameters

#### **E2E Tests (29 tests)**

- 🏥 **Health Check**: API health endpoint
- 📖 **Documentation**: Swagger UI and HTML pages
- 🔐 **Authentication**: Complete signup/login flows
- ✂️ **URL Shortening**: Anonymous and authenticated URLs
- 📋 **Management**: Complete URL CRUD
- 🔗 **Redirection**: Functionality and click counting
- ⚠️ **Error Handling**: Validations and edge cases

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

## 🚀 Quick Start (Docker)

**Prerequisites:** Docker & Docker Compose installed.

### 🎯 **Single Command - Run Everything Automatically**

```bash
# Option 1: Using Make (recommended)
make setup

# Option 2: Using bash script
./quick-start.sh

# Option 3: Using npm
npm run dev:quick
```

**That's it!** 🎉 In a few seconds you'll have:

- ✅ PostgreSQL database configured automatically
- ✅ API running at `http://localhost:8080`
- ✅ `.env` file created with default settings
- ✅ Everything working without any manual configuration

### 📱 **Accessing the API**

After running the command above, access:

- **🌐 API**: `http://localhost:8080`
- **📖 Swagger UI**: `http://localhost:8080/docs`
- **📄 Documentação HTML**: `http://localhost:8080/readme`
- **🏥 Health Check**: `GET http://localhost:8080`

### 🔧 **Management Commands**

```bash
# View real-time logs
make logs
# or: docker-compose logs -f

# Stop containers
make stop
# or: docker-compose down

# Restart
make restart

# Container status
make status
# or: docker-compose ps

# Complete cleanup
make clean

# View all available commands
make help
```

### ⚙️ **Available NPM Scripts**

```bash
npm run dev:quick       # Quick setup + start
npm run docker:setup    # Create .env file
npm run docker:build    # Build images
npm run docker:up       # Start containers
npm run docker:down     # Stop containers
npm run docker:logs     # View logs
npm run docker:clean    # Complete cleanup
```

### 🎛️ **Manual Configuration (Optional)**

If you want to customize the settings:

1. **Create `.env` file** (if it doesn't exist):

   ```bash
   cp .env.example .env
   ```

2. **Edit `.env`** with your settings:

   ```dotenv
   POSTGRES_USER=urlshortener
   POSTGRES_PASSWORD=password123
   POSTGRES_DB=urlshortener_db
   DATABASE_URL=postgres://urlshortener:password123@db:5432/urlshortener_db
   PORT=8080
   BASE_URL=http://localhost:8080
   JWT_SECRET=super-secret-jwt-key-change-in-production
   JWT_EXPIRES_IN=3600s
   ```

3. **Start containers**:
   ```bash
   docker-compose up --build
   ```

### 🔍 **Main Endpoints**

- **✂️ Shorten URL**: `POST /shorten`
- **🔗 Redirection**: `GET /:code`
- **🔐 Signup**: `POST /auth/signup`
- **🔑 Login**: `POST /auth/login`
- **📋 Manage URLs** (auth): `GET /urls`, `PATCH /urls/:id`, `DELETE /urls/:id`

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
├── .env.example                  # Template de configuração
├── .gitignore
├── Dockerfile
├── docker-compose.yml           # Orquestração Docker
├── Makefile                     # Comandos make para facilitar uso
├── quick-start.sh              # Script bash para setup rápido
├── package.json
├── tsconfig.json
├── DOCKER_SECURITY.md          # Docker Compose security guide
├── QUICK_START.md              # Super quick installation guide
├── SWAGGER_DOCUMENTATION.md    # API documentation
├── TEST_API.md                 # API testing guide
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
