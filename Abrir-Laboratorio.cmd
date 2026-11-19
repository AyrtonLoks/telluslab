@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
  echo Node.js 20 ou superior e necessario para iniciar o TellusLab.
  pause
  exit /b 1
)
set "MATH_LAB_OPEN=1"
call npm.cmd start
if errorlevel 1 pause

