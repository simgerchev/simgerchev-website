#!/bin/bash

echo "🚀 Starting Simgerchev Blog System..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📦 Building and starting all containers..."
docker-compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "✅ Blog system is starting up!"
echo ""
echo "📍 Service URLs:"
echo "   - Frontend:    http://localhost:5173"
echo "   - Backend API: http://localhost:5000"
echo "   - Blog:        http://localhost:5173/blog"
echo "   - Admin Panel: http://localhost:5173/admin"
echo ""
echo "🔑 Default Admin Credentials:"
echo "   Email:    admin@simgerchev.com"
echo "   Password: changeme123"
echo ""
echo "📋 Useful commands:"
echo "   View logs:       docker-compose logs -f"
echo "   Stop services:   docker-compose down"
echo "   Restart:         docker-compose restart"
echo ""
echo "📖 See BLOG_SETUP.md for detailed documentation"
