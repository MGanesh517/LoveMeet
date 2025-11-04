@echo off
echo Starting LoveMeet Backend Server...
cd backend
echo.
echo Installing dependencies if needed...
call npm install
echo.
echo Starting server...
call npm run dev
pause

