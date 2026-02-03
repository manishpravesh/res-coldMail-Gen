# Helper script to start all services for LanditAI

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting LanditAI Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Redis is running
try {
    $redisCheck = redis-cli ping 2>&1
    if ($redisCheck -eq "PONG") {
        Write-Host "✓ Redis is already running" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Starting Redis..." -ForegroundColor Yellow
    Start-Process "redis-server" -NoNewWindow
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "Starting Backend (FastAPI)..." -ForegroundColor Yellow
Write-Host "Opening new terminal for backend..." -ForegroundColor Gray

# Start backend in new terminal
$backendScript = @"
cd backend
.\venv\Scripts\Activate.ps1
Write-Host 'Backend server starting...' -ForegroundColor Green
python main.py
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendScript

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "Starting Frontend (Vite + React)..." -ForegroundColor Yellow
Write-Host "Opening new terminal for frontend..." -ForegroundColor Gray

# Start frontend in new terminal
$frontendScript = @"
cd frontend
Write-Host 'Frontend dev server starting...' -ForegroundColor Green
npm run dev
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendScript

Start-Sleep -Seconds 2

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Services Started!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Redis: Running" -ForegroundColor Green
Write-Host "✓ Backend: http://localhost:8000" -ForegroundColor Green
Write-Host "✓ Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "✓ API Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
Write-Host "Stopping services..." -ForegroundColor Yellow

# Stop processes
Stop-Process -Name "python" -ErrorAction SilentlyContinue
Stop-Process -Name "node" -ErrorAction SilentlyContinue

Write-Host "✓ Services stopped" -ForegroundColor Green
