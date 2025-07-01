# Script para iniciar el servidor de desarrollo
Write-Host "Iniciando servidor de desarrollo de AhorraYa VZ..." -ForegroundColor Green

# Cambiar al directorio del proyecto
Set-Location $PSScriptRoot

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "Node.js versión: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar si npm está disponible
try {
    $npmVersion = npm --version
    Write-Host "npm versión: $npmVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: npm no está disponible" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Instalar dependencias si no existen
if (-not (Test-Path "node_modules")) {
    Write-Host "Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error al instalar dependencias" -ForegroundColor Red
        Read-Host "Presiona Enter para salir"
        exit 1
    }
}

# Iniciar el servidor de desarrollo
Write-Host "Iniciando servidor de desarrollo en http://localhost:3000" -ForegroundColor Green
Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Yellow
npm run dev