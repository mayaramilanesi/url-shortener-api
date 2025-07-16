#!/bin/bash

# URL Shortener API - Quick Start Script
# This script sets up and runs the complete project in Docker

set -e

echo "🚀 URL Shortener API - Quick Start"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ Docker Compose not found. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker is running"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file with default settings..."
    cat > .env << EOF
# Database Configuration
POSTGRES_USER=urlshortener_dev
POSTGRES_PASSWORD=local_dev_password_123
POSTGRES_DB=urlshortener_dev_db
DATABASE_URL=postgres://urlshortener_dev:local_dev_password_123@db:5432/urlshortener_dev_db

# Application Configuration
PORT=8080
BASE_URL=http://localhost:8080

# JWT Configuration
JWT_SECRET=local-development-jwt-secret-CHANGE-FOR-PRODUCTION
JWT_EXPIRES_IN=3600s

# Development Mode
NODE_ENV=development
EOF
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down > /dev/null 2>&1 || true

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services started successfully!"
    echo ""
    echo "🌐 API available at:"
    echo "   • URL: http://localhost:8080"
    echo "   • Health Check: http://localhost:8080"
    echo "   • Swagger UI: http://localhost:8080/docs"
    echo "   • Documentation: http://localhost:8080/readme"
    echo ""
    echo "📊 Useful commands:"
    echo "   • View logs: docker-compose logs -f"
    echo "   • Stop: docker-compose down"
    echo "   • Rebuild: docker-compose up --build"
    echo ""
    echo "🎉 Everything ready! API is running!"
else
    echo "❌ Error starting services. Checking logs..."
    docker-compose logs
    exit 1
fi 