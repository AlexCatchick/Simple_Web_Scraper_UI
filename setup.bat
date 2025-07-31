@echo off
REM Web Scraper Setup Script for Windows

echo 🚀 Setting up Web Scraper Application...

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js detected: 
node -v

REM Install dependencies
echo 📦 Installing dependencies...
call npm run install-all

REM Create environment files if they don't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    echo NODE_ENV=development > .env
    echo DATABASE_URL=./database/scraper.db >> .env
    echo RATE_LIMIT_WINDOW=15 >> .env
    echo RATE_LIMIT_MAX=100 >> .env
)

if not exist "client\.env" (
    echo 📝 Creating client/.env file...
    echo VITE_API_URL=http://localhost:5000/api > client\.env
)

REM Build the application
echo 🔨 Building application...
call npm run build

echo ✅ Setup complete!
echo.
echo 🎯 Next steps:
echo 1. Start development server: npm run dev
echo 2. Open browser to: http://localhost:5173
echo 3. Test with: https://example.com and 'h1' selector
echo.
echo 📚 Documentation:
echo - Test cases: TEST_CASES.md
echo - Deployment: DEPLOYMENT.md
echo - API health: http://localhost:5000/api/health

pause
