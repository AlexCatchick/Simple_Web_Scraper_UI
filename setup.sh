#!/bin/bash

# Web Scraper Setup Script
echo "🚀 Setting up Web Scraper Application..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm run install-all

# Create environment files if they don't exist
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
NODE_ENV=development
DATABASE_URL=./database/scraper.db
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
EOL
fi

if [ ! -f "client/.env" ]; then
    echo "📝 Creating client/.env file..."
    cat > client/.env << EOL
VITE_API_URL=http://localhost:5000/api
EOL
fi

# Build the application
echo "🔨 Building application..."
npm run build

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start development server: npm run dev"
echo "2. Open browser to: http://localhost:5173"
echo "3. Test with: https://example.com and 'h1' selector"
echo ""
echo "📚 Documentation:"
echo "- Test cases: TEST_CASES.md"
echo "- Deployment: DEPLOYMENT.md"
echo "- API health: http://localhost:5000/api/health"
