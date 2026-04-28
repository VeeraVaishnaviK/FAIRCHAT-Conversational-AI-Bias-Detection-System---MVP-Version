# Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; if (Test-Path venv) { .\venv\Scripts\activate }; uvicorn main:app --reload --port 8000"

# Start Frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "FAIRCHAT starting... Backend on 8000, Frontend on 5173" -ForegroundColor Green
