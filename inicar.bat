@echo off
title ComandaFlow - Setup
echo ===============================
echo Iniciando setup do ComandaFlow...
echo ===============================

:: Verifica se está rodando como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERRO: Execute como Administrador!
    pause
    exit /b 1
)

set "BASE=E:\comandaflow"
set "NSSM=%BASE%\nssm\nssm-2.24\win64\nssm.exe"
set "SERVICE=ComandaFlow"

:: Baixa o NSSM se não existir
if not exist "%NSSM%" (
    echo Baixando NSSM...
    powershell -Command "Invoke-WebRequest -Uri 'https://nssm.cc/release/nssm-2.24.zip' -OutFile '%BASE%\nssm.zip'"
    echo Extraindo NSSM...
    powershell -Command "Expand-Archive -Path '%BASE%\nssm.zip' -DestinationPath '%BASE%\nssm' -Force"
    del "%BASE%\nssm.zip"
    echo NSSM pronto!
)

:: Cria o bat de start (sem pause, para rodar como servico)
echo Criando script de inicializacao...
(
    echo @echo off
    echo cd /d %BASE%
    echo if not exist logs mkdir logs
    echo echo [%%date%% %%time%%] Iniciando backend... ^>^> logs\backend.log
    echo start "BACKEND" cmd /k cd /d %BASE%\backend ^&^& npm run dev
    echo timeout /t 5 ^> nul
    echo echo [%%date%% %%time%%] Iniciando frontend... ^>^> logs\frontend.log
    echo start "FRONTEND" cmd /k cd /d %BASE%\frontend ^&^& npm run dev
    echo timeout /t 5 ^> nul
    echo start http://localhost:3000/
) > "%BASE%\run.bat"

:: Remove servico antigo se existir
sc query "%SERVICE%" >nul 2>&1
if %errorLevel% equ 0 (
    echo Removendo servico antigo...
    "%NSSM%" stop "%SERVICE%" >nul 2>&1
    "%NSSM%" remove "%SERVICE%" confirm >nul 2>&1
)

:: Cria o servico
echo Criando servico Windows...
"%NSSM%" install "%SERVICE%" "%BASE%\run.bat"
"%NSSM%" set "%SERVICE%" DisplayName "ComandaFlow"
"%NSSM%" set "%SERVICE%" Description "Sistema de comanda digital"
"%NSSM%" set "%SERVICE%" Start SERVICE_AUTO_START
"%NSSM%" set "%SERVICE%" AppDirectory "%BASE%"

:: Inicia o servico
echo Iniciando servico...
"%NSSM%" start "%SERVICE%"

echo ===============================
echo Servico ComandaFlow instalado!
echo Ele vai iniciar automaticamente com o Windows.
echo Para gerenciar: services.msc
echo ===============================
pause