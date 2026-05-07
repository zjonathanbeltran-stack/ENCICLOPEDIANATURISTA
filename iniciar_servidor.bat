@echo off
title Enciclopedia de Plantas Medicinales
cd /d "%~dp0"
echo.
echo  =========================================
echo   Enciclopedia Naturista de Chile
echo  =========================================
echo.
echo  Iniciando servidor local...
echo  Abre tu navegador en: http://localhost:8000
echo.
echo  Presiona Ctrl+C para detener el servidor.
echo.
start "" http://localhost:8000
python -m http.server 8000
pause
