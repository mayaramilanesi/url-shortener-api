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

**Local Development:**

- **Interactive Swagger UI**: `http://localhost:8080/docs`
- **HTML Documentation**: `http://localhost:8080/readme`

**Production/Cloud Deployment:**

- **Interactive Swagger UI**: `https://your-domain.com/docs`
- **HTML Documentation**: `https://your-domain.com/readme`

**Features:**

- Test all endpoints directly in your browser
- Built-in JWT authentication
- Real-time request/response examples
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
- Node.js >=24.4.1 (latest stable version, locked in `package.json` engines)
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

### 📊 **Understanding Coverage Report**

The HTML report (`coverage/index.html`) shows:

- 🟢 **Green Lines**: Code covered by tests
- 🔴 **Red Lines**: Untested code
- 🟡 **Yellow Lines**: Partially tested code

**Key metrics:**

- **Statements**: Percentage of executed lines
- **Branches**: Percentage of tested conditionals (if/else)
- **Functions**: Percentage of called functions
- **Lines**: Percentage of covered physical lines

### 🚀 **Running Tests During Development**

```bash
# For active development
npm run test:unit:watch    # Re-runs tests when files change

# For complete validation
npm run test:all           # Run everything before commit

# For debugging
npm run test:unit -- --verbose  # More test details
```

### 🔄 **CI/CD**

Tests are automatically executed on:

- **Push/PR**: Unit and e2e tests
- **Coverage check**: Verifies coverage meets thresholds
- **Isolated environment**: Each test uses SQLite in-memory database

### 🤝 **Contributing with Tests**

1. **New features**: Always include unit tests
2. **Bug fixes**: Add test that reproduces the bug
3. **Controllers**: Unit tests for call validation
4. **Services**: Comprehensive tests with proper mocks
5. **E2E**: For complete user flows

**Conventions:**

- Test files: `*.spec.ts` (unit) and `*.e2e-spec.ts` (e2e)
- Mocks: Use Jest mocks for external dependencies
- Cleanup: Always clean test data (especially e2e)

---

### 📱 **Accessing the API**

After running the command above, access:

- **🌐 API**: `http://localhost:8080`
- **📖 Swagger UI**: `http://localhost:8080/docs`
- **📄 HTML Documentation**: `http://localhost:8080/readme`
- **🏥 Health Check**: `GET http://localhost:8080`

> 💡 **Note:** For production/cloud deployments, replace `localhost:8080` with your actual domain (e.g., `https://your-domain.com`)

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

> 💡 **Quick Option:** For a faster setup, use `make setup` instead of the steps below (requires Docker)

1. Ensure Node.js v24.4.1+ installed.
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
│   │   ├── *.spec.ts              # Unit tests
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── dto/
│   ├── docs/
│   │   ├── docs.controller.ts
│   │   └── docs.module.ts
│   ├── users/
│   │   ├── *.spec.ts              # Unit tests
│   │   ├── users.service.ts
│   │   └── entities/
│   ├── urls/
│   │   ├── *.spec.ts              # Unit tests
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
│   ├── app.e2e-spec.ts           # Complete e2e tests
│   ├── jest-e2e.json             # Jest e2e configuration
│   ├── setup.ts                  # Global setup
│   ├── test-app.module.ts        # Module for tests
│   └── test-database.module.ts   # SQLite database configuration
├── coverage/                     # Coverage reports
│   └── index.html               # Interactive HTML report
├── jest.config.ts               # Main Jest configuration
├── .env.example                  # Configuration template
├── .gitignore
├── Dockerfile
├── docker-compose.yml           # Docker orchestration
├── Makefile                     # Make commands for easy usage
├── quick-start.sh              # Bash script for quick setup
├── package.json
├── tsconfig.json
├── DOCKER_SECURITY.md          # Docker Compose security guide
├── QUICK_START.md              # Super quick installation guide
├── SWAGGER_DOCUMENTATION.md    # API documentation
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
- `v0.5.0` — comprehensive testing suite with unit and e2e tests
- `v0.6.0` — Docker automation with one-command setup
