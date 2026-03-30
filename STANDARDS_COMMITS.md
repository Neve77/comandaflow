# 📝 Padrões & Boas Práticas - ComandaFlow

## 1️⃣ Conventional Commits

Use este padrão para TODOS os commits:

### Formato
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type (Obrigatório)
| Type | Uso | Exemplo |
|------|-----|---------|
| `feat` | Nova funcionalidade | `feat(auth): add password reset` |
| `fix` | Correção de bug | `fix(orders): resolve socket emit failure` |
| `refactor` | Melhoria de código | `refactor(api): extract status handler` |
| `style` | Formatação (sem lógica) | `style: fix indentation in auth.js` |
| `chore` | Deps, build, config | `chore(deps): update fastify to v4.25.0` |
| `docs` | Documentação | `docs: add API endpoints documentation` |
| `test` | Testes | `test(auth): add login validation tests` |
| `ci` | CI/CD workflow | `ci: add ESLint to GitHub Actions` |
| `perf` | Performance | `perf(db): add index to orders table` |

### Scope (Recomendado)
- `auth` - Autenticação
- `api` - API geral
- `socket` - Socket.IO
- `db` - Banco de dados
- `ui` - Frontend
- `config` - Configuração
- `deps` - Dependências

### Subject (Obrigatório)
- ✅ Imperativo: "add feature" (não "added" ou "adds")
- ✅ Sem ponto final (.)
- ✅ Minúsculo (exceto nomes próprios)
- ✅ Máximo 50 caracteres

### Body (Quando necessário)
```
feat(orders): add real-time order notifications

Implement WebSocket handler for order status updates.
Adds feature to notify kitchen in real-time when new orders arrive
and track preparation status.

- Extract Socket.IO handlers to separate module
- Add notifyKitchen event emitter
- Standardize error handling in socket events
```

### Footer (Para breaking changes)
```
BREAKING CHANGE: remove /pedidos/listar endpoint

Use GET /pedidos?limit=50&offset=0 instead
```

### Exemplos Completos

✅ **BOM**
```
feat(auth): add JWT token refresh

Add refresh token mechanism to extend session without re-login.
Reduces unnecessary password prompts during active usage.

- Implement refresh token generation
- Add token rotation strategy
- Extend session timeout to 7 days
```

✅ **BOM**
```
fix(orders): resolve duplicate message emission

Socket.IO event was emitted twice due to missing event.off()
in cleanup handler.

Fixes: #342
```

✅ **BOM**
```
refactor: extract duplicate status update logic

Remove 3 copies of status update code in socket handlers.
Create reusable updateOrderStatus function.
```

❌ **RUIM**
```
Update auth.js
```

❌ **RUIM**
```
fixed bug in authentication
```

❌ **RUIM**
```
Changes made to improve performance
```

---

## 2️⃣ Estrutura de Branches

```
main
├── develop (staging)
│   ├── feature/auth-2fa
│   ├── feature/order-scheduling
│   ├── fix/socket-connection
│   └── refactor/database-schema
```

### Nomeação
```
<type>/<descriptive-name>

feature/user-authentication
fix/socket-reconnection
refactor/error-handling
docs/api-endpoints
chore/dependencies-update
```

### Fluxo
1. Criar branch da `develop`
2. Commitar com Conventional Commits
3. Abrir PR com descrição detalhada
4. Review + merge
5. Delete branch

---

## 3️⃣ .gitignore Completo

```bash
# Dependências
node_modules/
/.npm
/package-lock.json
/yarn.lock

# Ambiente
.env
.env.*.local
.env.production
.env.production.local
!.env.example
!.env.development.example

# IDE & Editor
.vscode/
.idea/
*.swp
*.swo
*.swn
*.sublime-*
.DS_Store
Thumbs.db
*.code-workspace

# Database
database.db
*.sqlite
*.sqlite3
/database/*.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Build & Distribution
dist/
build/
out/
.next/
.cache/

# Testing
coverage/
/coverage
.nyc_output/
*.lcov

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db

# Temporary
tmp/
temp/
*.tmp

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# macOS
.AppleDouble
.AppleDB
```

---

## 4️⃣ Padrão de Mensagens de Erro

### API Responses

**Sucesso:**
```json
{
  "data": { ... },
  "timestamp": "2026-03-30T10:30:00Z"
}
```

**Erro:**
```json
{
  "erro": "Mensagem descritiva",
  "code": "ERROR_CODE",
  "statusCode": 400,
  "timestamp": "2026-03-30T10:30:00Z"
}
```

**Validação:**
```json
{
  "erro": "Dados inválidos",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "timestamp": "2026-03-30T10:30:00Z",
  "details": [
    {
      "field": "email",
      "message": "Email inválido"
    }
  ]
}
```

---

## 5️⃣ Code Review Checklist

Antes de fazer PR:

- [ ] Código está limpo (sem console.log, comentários obsoletos)
- [ ] Segue Conventional Commits
- [ ] Testado localmente
- [ ] Sem `console.log()` (usar logger)
- [ ] Sem variáveis não utilizadas
- [ ] Sem imports não utilizados
- [ ] Tratamento de erros implementado
- [ ] .env variáveis documentadas
- [ ] Sem hardcoded values
- [ ] Compatível com versão Node.js (18.16.0)

---

## 6️⃣ Environment Setup

### Desenvolvimento
```bash
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
DATABASE_PATH=./database/database.db
JWT_SECRET=seu-segredo-super-secreto-alterar-em-producao
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Staging (antes de produção)
```bash
NODE_ENV=staging
PORT=4000
HOST=0.0.0.0
DATABASE_PATH=/data/database.db
JWT_SECRET=<gerar-aleatorio-64-chars>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://staging.comandaflow.com
LOG_LEVEL=info
```

### Produção
```bash
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
DATABASE_PATH=/data/database.db
JWT_SECRET=<gerar-aleatorio-128-chars>
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://comandaflow.com
LOG_LEVEL=warn
```

---

## 7️⃣ Versionamento Semântico

**Format:** `MAJOR.MINOR.PATCH`

```
1.0.0  →  1.0.1  (patch: bug fix)
1.0.1  →  1.1.0  (minor: new feature)
1.1.0  →  2.0.0  (major: breaking change)
```

**Quando bumapar:**
- `MAJOR`: API changes (breaking)
- `MINOR`: New backward-compatible features
- `PATCH`: Bug fixes

**Exemplo:**
```json
{
  "version": "1.2.3",
  "name": "comandaflow",
  "description": "Sistema de comanda com real-time"
}
```

---

## 8️⃣ CI/CD Checklist (GitHub Actions)

```yaml
name: CI/CD

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18.16.0'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm run test
      
      - name: Build
        run: npm run build
```

---

## 9️⃣ Deploy Checklist

Antes de fazer deploy:

- [ ] Todos os testes passando
- [ ] Code review aprovado
- [ ] .env variables configuradas
- [ ] JWT_SECRET gerado (aleatório, 128+ chars)
- [ ] DATABASE_PATH aponta a local persistente
- [ ] CORS_ORIGIN correto para produção
- [ ] LOG_LEVEL = warn/error
- [ ] Backup do banco anterior feito
- [ ] Rollback plan documentado

---

## 🔟 Emergency Rollback

Se algo der ruim em produção:

```bash
# 1. Revert último commit
git revert HEAD

# 2. Ou voltar a versão anterior
git checkout v1.2.0

# 3. Rebuild & deploy
npm run build
npm run deploy

# 4. Verificar logs
tail -f logs/production.log

# 5. Se banco corrompido, restaurar backup
cp /backup/database.db.bak /data/database.db
```

---

**Próxima Leitura:** [REFACTOR_IMPLEMENTATION.md](REFACTOR_IMPLEMENTATION.md)
