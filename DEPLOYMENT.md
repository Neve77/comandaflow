# 🚀 Guia de Deployment

## Antes de fazer Push para GitHub

### ✅ Checklist de Segurança

- [ ] **Variáveis de Ambiente**
  - [ ] `.env` e `.env.local` estão em `.gitignore`
  - [ ] `.env.example` foi criado como template
  - [ ] Nunca versione credenciais reais

- [ ] **Arquivos Sensíveis**
  - [ ] `database.db` está ignorado
  - [ ] `node_modules/` está ignorado
  - [ ] Arquivos pessoais/privados estão ignorados

- [ ] **Configurações Git**
  - [ ] `.gitignore` está correto
  - [ ] `.editorconfig` foi criado
  - [ ] `.prettierrc` foi criado

- [ ] **Documentação**
  - [ ] README.md está atualizado
  - [ ] GETTING_STARTED.md existe
  - [ ] CONTRIBUTING.md foi revisado
  - [ ] LICENSE foi adicionado

- [ ] **Qualidade de Código**
  - [ ] Sem console.log() em produção
  - [ ] Sem comentários de debug
  - [ ] Código testado localmente
  - [ ] Sem erros no console

- [ ] **Backend**
  - [ ] Por npm install e npm run dev com sucesso
  - [ ] npm run seed populou dados corretamente
  - [ ] API respondendo em http://localhost:4000

- [ ] **Frontend**
  - [ ] npm install funcionou
  - [ ] npm run dev iniciou sem erros
  - [ ] Aplicação carregando em http://localhost:3000
  - [ ] Login funcionando com credenciais de teste

### 🔒 Segredos Antes do Push

**❌ NÃO versione:**
```
.env                    # Variáveis sensíveis
.env.local             # Configuração local
database.db            # Banco de dados
node_modules/          # Dependências
.vscode/               # Preferências VS Code
.idea/                 # Preferências IntelliJ
*.log                  # Arquivos de log
.DS_Store              # Arquivos macOS
```

**✅ Sempre versione:**
```
.env.example          # Template das variáveis
.gitignore           # Arquivo de ignore
.editorconfig        # Padrões de código
.prettierrc           # Configuração Prettier
README.md            # Documentação
package.json         # Dependências
package-lock.json    # Versões exatas (optional)
LICENSE              # Licença
```

## Processo de Push para GitHub

### 1. Preparação Final

```bash
# Verificar status
git status

# Limpar node_modules (opcional)
rm -rf backend/node_modules frontend/node_modules

# Remover banco de dados (será refeito com seed)
rm backend/database.db

# Adicionar todos os arquivos
git add .

# Verificar o que será commitado
git diff --cached
```

### 2. Primeiro Commit

```bash
# Criar commit inicial
git commit -m "feat: initial commit - ComandaFlow v1.0.0

- Backend: Fastify + SQLite + JWT + Socket.io
- Frontend: Next.js + Tailwind CSS + React
- Componentes U reutilizáveis
- Autenticação e autorização
- Sistema completo de gerenciamento de pedidos"

# Configurar branch main (se necessário)
git branch -M main

# Push para GitHub
git push -u origin main
```

### 3. Após o Push

```bash
# Verificar que os arquivos foram para o GitHub
git log --oneline

# Tag para versão
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# Criar release no GitHub (web interface)
# Ir para Releases e criar nova release
```

## Configuração no GitHub

### 1. Settings do Repositório

- [ ] **General**
  - [ ] Descrição: "Sistema de gerenciamento de comandas digital"
  - [ ] Website: sua-url-aqui.com (se houver)
  - [ ] Topics: `nodejs`, `fastify`, `nextjs`, `tailwindcss`, `socket-io`

- [ ] **Visibility**
  - [ ] Public (para open source) ou Private (se necessário)

- [ ] **Branch Protection Rules**
  - [ ] Proteger branch `main`
  - [ ] Require pull requests
  - [ ] Require status checks (CI/CD)

### 2. Secrets (para workflows)

Se usar CI/CD, adicione secrets:

```
DEPLOY_KEY         # Chave SSH para deploy
DATABASE_URL       # URL do banco em produção
JWT_SECRET         # Secret grande e aleatório
```

### 3. Actions

- [ ] Verificar workflows em `.github/workflows/`
- [ ] Ativar GitHub Actions se desejável
- [ ] Configurar status checks

## Deploy em Produção

### Variáveis de Ambiente Seguras

**Backend (.env em produção):**
```
NODE_ENV=production
PORT=4000
JWT_SECRET=gerar-chave-aleatorias-12345-muito-longa
DATABASE=/var/lib/comandaflow/database.db
LOG_LEVEL=warn
ALLOWED_ORIGINS=https://seu-dominio.com
```

**Frontend (.env.local em produção):**
```
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
NEXT_PUBLIC_SOCKET_URL=https://api.seu-dominio.com
NODE_ENV=production
```

### Opções de Deploy

#### ✅ Heroku
```bash
heroku login
heroku create seu-app-name
git push heroku main
```

#### ✅ Vercel (Frontend)
```
Conectar repo ao Vercel
Vercel faz deploy automático a cada push
```

#### ✅ Docker
```bash
docker-compose up -d
```

#### ✅ DigitalOcean/AWS/GCP
- Usar Docker containers
- Nginx como reverse proxy
- SSL com Let's Encrypt
- Database PostgreSQL (migrar do SQLite)

## Monitoramento em Produção

### Logs

```bash
# Backend logs
npm run dev 2>&1 | tee app.log

# Monitoring
pm2 start server.js --name "comandaflow-api"
pm2 logs comandaflow-api
```

### Uptime Monitoring

- UptimeRobot: https://uptimerobot.com
- StatusPage: https://www.statuspage.io

### Backups

```bash
# Backup automático do banco
0 2 * * * cp /path/to/database.db /backup/database-$(date +\%Y\%m\%d).db
```

## Troubleshooting

### Erro: "origin does not appear to be a git repository"
```bash
git remote add origin https://github.com/seu-usuario/comandaflow.git
git branch -M main
git push -u origin main
```

### Erro: "remote: Permission to push"
```bash
# Configurar SSH key
ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub  # Adicionar ao GitHub
```

### Pasta vazia não é comitada
```bash
# Git ignora pastas vazias, criar arquivo vazio
touch pasta-vazia/.gitkeep
git add pasta-vazia/.gitkeep
```

---

**🎉 Pronto para fazer seu repositório público!**

Dúvidas? Consulte:
- [GitHub Docs](https://docs.github.com)
- [Git Documentation](https://git-scm.com/doc)
