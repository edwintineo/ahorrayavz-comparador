@echo off
echo Iniciando servidor de desarrollo...
cd /d "%~dp0"
npm install
npm run dev
pause