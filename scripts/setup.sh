#!/usr/bin/env bash
set -e

echo "=== TourMate Dev Setup ==="

# Check dependencies
command -v docker &>/dev/null || { echo "Docker is required"; exit 1; }
command -v docker compose version &>/dev/null || { echo "Docker Compose v2 is required"; exit 1; }

# Create .env if not exists
if [ ! -f .env ]; then
  cp .env.example .env
  # Generate secure JWT secret
  JWT_SECRET=$(openssl rand -hex 32)
  sed -i "s/<generate_256_bit_secret>/$JWT_SECRET/" .env
  # Generate DB password
  DB_PASS=$(openssl rand -hex 16)
  sed -i "s/<generate_secure_password>/$DB_PASS/" .env
  echo "✓ Created .env with generated secrets"
fi

# Start Docker services
echo "Starting Docker services..."
docker compose up -d postgres redis

# Wait for Postgres
echo "Waiting for PostgreSQL..."
until docker exec tourmate-postgres pg_isready -U tourmate -q; do sleep 1; done
echo "✓ PostgreSQL ready"

# Run migrations
echo "Running database migrations..."
cd backend
npm install --quiet
npm run migrate
echo "✓ Migrations complete"

# Seed data
echo "Seeding destinations and activities..."
npm run seed
echo "✓ Seed data loaded"

cd ..
echo ""
echo "=== Setup complete! ==="
echo "Start the full stack: docker compose up"
echo "Backend API:          http://localhost:3000/api/health"
echo "Stop services:        docker compose down"
