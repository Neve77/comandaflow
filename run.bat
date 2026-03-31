@echo off
cd /d E:\comandaflow
if not exist logs mkdir logs
start "BACKEND" cmd /k "cd /d E:\comandaflow\backend && npm run dev"
timeout /t 5 > nul
start "FRONTEND" cmd /k "cd /d E:\comandaflow\frontend && npm run dev"
timeout /t 5 > nul
start http://localhost:3000/
