# URL Shortener API - Makefile
# Commands to facilitate development

.PHONY: help setup start stop restart logs clean test build

# Default command
help:
	@echo "🚀 URL Shortener API - Available Commands"
	@echo "========================================"
	@echo ""
	@echo "📦 Setup & Start:"
	@echo "  make setup    - Initial setup + start (MAIN COMMAND)"
	@echo "  make start    - Start containers in background"
	@echo "  make dev      - Start in development mode with logs"
	@echo ""
	@echo "🔧 Management:"
	@echo "  make stop     - Stop all containers"
	@echo "  make restart  - Restart containers"
	@echo "  make logs     - Show real-time logs"
	@echo "  make status   - Container status"
	@echo ""
	@echo "🧹 Cleanup:"
	@echo "  make clean    - Remove containers, volumes and images"
	@echo "  make reset    - Complete reset + rebuild"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  make test     - Run all tests"
	@echo "  make test-cov - Tests with HTML coverage"
	@echo ""
	@echo "🔨 Build:"
	@echo "  make build    - Rebuild images"

# Initial setup - MAIN COMMAND
setup:
	@echo "🚀 Setting up and starting URL Shortener API..."
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env file..."; \
		echo "# Database Configuration" > .env; \
		echo "POSTGRES_USER=urlshortener_dev" >> .env; \
		echo "POSTGRES_PASSWORD=local_dev_password_123" >> .env; \
		echo "POSTGRES_DB=urlshortener_dev_db" >> .env; \
		echo "DATABASE_URL=postgres://urlshortener_dev:local_dev_password_123@db:5432/urlshortener_dev_db" >> .env; \
		echo "" >> .env; \
		echo "# Application Configuration" >> .env; \
		echo "PORT=8080" >> .env; \
		echo "BASE_URL=http://localhost:8080" >> .env; \
		echo "" >> .env; \
		echo "# JWT Configuration" >> .env; \
		echo "JWT_SECRET=local-development-jwt-secret-CHANGE-FOR-PRODUCTION" >> .env; \
		echo "JWT_EXPIRES_IN=3600s" >> .env; \
		echo "" >> .env; \
		echo "# Development Mode" >> .env; \
		echo "NODE_ENV=development" >> .env; \
		echo "✅ .env file created"; \
	fi
	@echo "🔨 Starting containers..."
	@docker-compose up --build -d
	@echo "⏳ Waiting for services..."
	@sleep 10
	@echo ""
	@echo "✅ API running at: http://localhost:8080"
	@echo "📖 Swagger UI: http://localhost:8080/docs"
	@echo "📄 Documentation: http://localhost:8080/readme"
	@echo ""
	@echo "🎉 Everything ready! Use 'make logs' to see the logs."

# Start containers
start:
	@docker-compose up -d

# Development mode with logs
dev:
	@docker-compose up --build

# Stop containers
stop:
	@docker-compose down

# Restart containers
restart: stop start

# Show logs
logs:
	@docker-compose logs -f

# Container status
status:
	@docker-compose ps

# Complete cleanup
clean:
	@echo "🧹 Cleaning containers, volumes and images..."
	@docker-compose down -v --rmi all --remove-orphans
	@echo "✅ Cleanup completed"

# Complete reset
reset: clean
	@echo "🔄 Complete reset with rebuild..."
	@$(MAKE) setup

# Build images
build:
	@docker-compose build --no-cache

# Run tests
test:
	@echo "🧪 Running tests..."
	@npm run test:all

# Tests with coverage
test-cov:
	@echo "📊 Running tests with coverage..."
	@npm run test:cov:html
	@echo "📊 Report: open coverage/index.html" 