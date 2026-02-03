# Start Backend Server
Write-Host "Starting LanditAI Backend Server..." -ForegroundColor Cyan

# Change to backend directory
Push-Location backend

# Start the server
& .\venv\Scripts\python.exe main.py

# Return to original directory
Pop-Location
