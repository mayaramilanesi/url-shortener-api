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

---

## 🛠️ Tech Stack

- NestJS v11 + TypeScript
- Node.js >=20.x (locked in `package.json` engines)
- PostgreSQL 15 via TypeORM
- JWT for authentication
- dotenv for environment configuration
- Docker & Docker Compose for local development

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
   - Health: `GET /`
   - Shorten: `POST /shorten`
   - Redirect: `GET /:code`
   - Auth: `POST /auth/signup`, `POST /auth/login`
   - URLs management (auth): `GET /urls`, `PATCH /urls/:id`, `DELETE /urls/:id`

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
├── src
│   ├── auth
│   ├── common
│   │   └── health.controller.ts
│   ├── users
│   ├── urls
│   │   ├── dto
│   │   ├── entities
│   │   ├── redirect.controller.ts
│   │   ├── shorten.controller.ts
│   │   ├── urls.controller.ts
│   │   └── urls.service.ts
│   ├── app.module.ts
│   └── main.ts
├── test
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
├── tsconfig.json
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
- `v0.4.0` — Docker & health check

---

## 📄 License

Licensed under the MIT License. See LICENSE for details.
