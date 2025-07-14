# URL Shortener API

A scalable, RESTful URL shortening service built with NestJS and TypeScript.  
Anyone can shorten a URL to a 6-character code; authenticated users can manage (list, update, delete) their own links, track click counts, and soft-delete records.

---

## 🚀 Features

- **Anonymous shorten**: `POST /shorten` accepts any URL and returns a 6-character short code.
- **Redirect & count**: `GET /:code` redirects to the original URL and increments its click counter.
- **User accounts & JWT auth**
  - **Register**: `POST /auth/signup`
  - **Login**: `POST /auth/login` → returns `Bearer <JWT>`
- **Per-user URL management** (requires `Authorization: Bearer <JWT>`)
  - **List**: `GET /urls` → includes click counts
  - **Update**: `PATCH /urls/:id` → change the target URL
  - **Delete**: `DELETE /urls/:id` → soft-delete (logical delete)
- **Audit fields**: `createdAt`, `updatedAt`, `deletedAt` on every record

---

## 🛠️ Tech Stack

- NestJS + TypeScript
- PostgreSQL (via TypeORM or Prisma)
- JWT for authentication
- dotenv for environment configuration

---

## 📥 Getting Started

### Prerequisites

- Node.js >= 16.x
- npm (bundled with Node.js) or yarn
- A running PostgreSQL instance

### Installation

1. **Clone the repo**
   ```bash
   git clone git@github.com:<your-username>/url-shortener-api.git
   cd url-shortener-api
   ```
2. **Environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set:
   ```
   PORT=8080
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   JWT_SECRET=your_jwt_secret_here
   ```
3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```
4. **Run in development**
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```
   The API will be available at `http://localhost:8080`.
5. **Build and run**
   ```bash
   npm run build
   npm run start
   # or
   yarn build && yarn start
   ```

---

## 📄 API Overview

| Method | Path           | Description                                        | Auth required |
| ------ | -------------- | -------------------------------------------------- | ------------- |
| GET    | `/`            | Health check / welcome                             | No            |
| POST   | `/shorten`     | Shorten a URL (body: `{ url: string }`)            | No            |
| GET    | `/:code`       | Redirect to original URL and increment click count | No            |
| POST   | `/auth/signup` | Register new user (body: `{ email, password }`)    | No            |
| POST   | `/auth/login`  | Login (body: `{ email, password }`) → returns JWT  | No            |
| GET    | `/urls`        | List all your shortened URLs                       | Yes           |
| PATCH  | `/urls/:id`    | Update a shortened URL’s target                    | Yes           |
| DELETE | `/urls/:id`    | Soft-delete a shortened URL                        | Yes           |

> Full OpenAPI / Swagger docs coming soon.

---

## 📁 Project Structure

```
.
├── src
│   ├── auth
│   ├── users
│   ├── urls
│   ├── common
│   ├── app.module.ts
│   └── main.ts
├── test
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## 💾 Database

Migrations should create tables:

- **users** (`id`, `email`, `passwordHash`, `createdAt`, `updatedAt`)
- **urls** (`id`, `code`, `targetUrl`, `ownerId`, `clickCount`, `createdAt`, `updatedAt`, `deletedAt`)

---

## 📜 Commit & Release Guidelines

We follow **Conventional Commits**:

- **feat:** a new feature
- **fix:** a bug fix
- **chore:** build process or auxiliary changes
- **docs:** documentation only changes
- **test:** adding or fixing tests
- **refactor:** code change that neither fixes a bug nor adds a feature

**Release tags**:

- `v0.1.0` — basic shortener endpoint (`POST /shorten`, `GET /:code`)
- `v0.2.0` — authentication & user signup/login
- `v0.3.0` — per-user URL management (list, update, delete)
- `v0.4.0` — click counting & statistics

---

## 🚧 Next Steps & Improvements

- Docker & docker-compose setup
- Unit & integration tests
- OpenAPI/Swagger documentation (`@nestjs/swagger`)
- Input validation with Pipes (`class-validator`)
- Observability: logs (Winston), metrics (Prometheus), tracing (OpenTelemetry)
- Multi-tenant support
- API Gateway integration (KrankeD)
- Kubernetes manifests & Terraform IaC
- GitHub Actions for CI (lint, tests, build)
- Pre-commit/pre-push hooks (Husky, lint-staged)

---

## 📄 License

Licensed under the MIT License. See LICENSE for details.
