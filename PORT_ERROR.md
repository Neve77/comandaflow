# 🔴 Porta 4000 Já Está em Uso

## Problema

Você pode estar com um processo antigo do backend rodando na porta 4000.

## Solução Rápida

### Windows PowerShell (Recomendado)

```powershell
# Abra PowerShell como Administrador e rode:

# Encontrar processo na porta 4000
Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess

# Matar o processo (coloque o PID encontrado acima)
Stop-Process -Id <PID> -Force

# Exemplo:
# Stop-Process -Id 21724 -Force
```

### Windows Command Prompt (CMD)

```cmd
# Abra CMD como Administrador:

REM Encontrar processo
netstat -ano | findstr :4000

REM Matar processo (substitua XXXX pelo PID)
taskkill /PID XXXX /F

REM Exemplo:
REM taskkill /PID 21724 /F
```

### Git Bash / MINGW64

```bash
# Se estiver no Git Bash:
PORT=4000

# Encontrar PID
lsof -i :$PORT 2>/dev/null || netstat -ano | grep :$PORT

# Depois resolver manualmente ou usar PowerShell
```

## ⚡ Alternativa: Usar Porta Diferente

Se preferir não matar o processo, modifique o arquivo `.env` do backend:

```bash
# backend/.env
NODE_ENV=development
PORT=5000          # ← Mude para 5000
HOST=0.0.0.0
JWT_SECRET=seu-segredo-super-secreto
DATABASE=database.db
LOG_LEVEL=info
```

E também atualize o frontend:

```bash
# frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000    # ← Mude para 5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000 # ← Mude para 5000
NODE_ENV=development
```

Depois rode:
```bash
# Backend
cd backend
npm run dev      # Agora na porta 5000

# Frontend (em outro terminal)
cd frontend
npm run dev      # Continua na 3000, mas conecta em 5000
```

## ✅ Próximos Passos

1. **Libere a porta 4000** (kill do processo) OU **use porta 5000**
2. **Abra 2 terminais**
3. **Terminal 1:** `cd backend && npm run dev`
4. **Terminal 2:** `cd frontend && npm run dev`
5. **Navegador:** `http://localhost:3000`
