# LanditAI Setup Script for Windows
# Run this script to set up the entire project

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  LanditAI Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "âœ“ Python found: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "âœ— Python not found. Please install Python 3.10+" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version 2>&1
    Write-Host "âœ“ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "âœ— Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
try {
    $pgVersion = psql --version 2>&1
    Write-Host "âœ“ PostgreSQL found: $pgVersion" -ForegroundColor Green
}
catch {
    Write-Host "âš  PostgreSQL not found or not in PATH" -ForegroundColor Yellow
    Write-Host "  Please ensure PostgreSQL is installed and running" -ForegroundColor Yellow
}

# Check Redis
try {
    $redisCheck = redis-cli ping 2>&1
    if ($redisCheck -eq "PONG") {
        Write-Host "âœ“ Redis is running" -ForegroundColor Green
    }
    else {
        Write-Host "âš  Redis is not responding" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "âš  Redis not found. Please install and start Redis" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setting up Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Backend setup
Set-Location backend

# Create virtual environment
if (!(Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
    Write-Host "âœ“ Virtual environment created" -ForegroundColor Green
}
else {
    Write-Host "âœ“ Virtual environment already exists" -ForegroundColor Green
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Install Python dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt
Write-Host "âœ“ Backend dependencies installed" -ForegroundColor Green

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "âœ“ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "âš  IMPORTANT: Please edit backend/.env and add:" -ForegroundColor Yellow
    Write-Host "  - DATABASE_URL (PostgreSQL connection string)" -ForegroundColor Yellow
    Write-Host "  - SECRET_KEY (generate with: python -c 'import secrets; print(secrets.token_hex(32))')" -ForegroundColor Yellow
    Write-Host "  - GROQ_API_KEY (from https://console.groq.com)" -ForegroundColor Yellow
    Write-Host ""
}
else {
    Write-Host "âœ“ .env file already exists" -ForegroundColor Green
}

# Return to root
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setting up Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Frontend setup
Set-Location frontend

# Install Node dependencies
Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
npm install
Write-Host "âœ“ Frontend dependencies installed" -ForegroundColor Green

# Create .env file if it doesn't exist
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "âœ“ .env file created" -ForegroundColor Green
}
else {
    Write-Host "âœ“ .env file already exists" -ForegroundColor Green
}

# Return to root
Set-Location ..

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Setup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Green
Write-Host "1. Edit backend/.env with your configuration" -ForegroundColor White
Write-Host "2. Create PostgreSQL database:" -ForegroundColor White
Write-Host "   psql -U postgres" -ForegroundColor Gray
Write-Host "   CREATE DATABASE landitai;" -ForegroundColor Gray
Write-Host "   CREATE USER landitai_user WITH PASSWORD 'your_password';" -ForegroundColor Gray
Write-Host "   GRANT ALL PRIVILEGES ON DATABASE landitai TO landitai_user;" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Start Redis:" -ForegroundColor White
Write-Host "   redis-server" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Start the backend (in backend folder):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   venv\Scripts\activate" -ForegroundColor Gray
Write-Host "   python main.py" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Start the frontend (in frontend folder, new terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "6. Open http://localhost:5173 in your browser" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see QUICKSTART.md" -ForegroundColor Cyan
Write-Host ""
