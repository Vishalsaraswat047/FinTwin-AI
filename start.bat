@echo off
title FinTwin AI
cd /d "%~dp0"
echo Starting FinTwin AI System...
start cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:5000
exit