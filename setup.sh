#!/bin/bash

# Connect Contact Manager Setup Script
echo "🚀 Starting setup..."

echo "📦 Installing dependencies for client and server..."
npm run install:all

echo "💎 Generating Prisma client..."
npm run prisma:generate

echo "✅ Setup complete! You can now start the app."
echo ""
echo "To run the app:"
echo "1. Start server: npm run dev:server"
echo "2. Start client: npm run dev:client (in a new terminal)"
