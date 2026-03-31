# 🚀 Guia de Produção - ComandaFlow

## 📋 Pré-Requisitos

### Sistema Operacional
- **Windows 10/11** ou **Linux/macOS com WSL2**
- **Node.js 18+** (recomendado LTS)
- **Git** (para versionamento)

### Dependências Globais
```bash
npm install -g pm2  # Para gerenciar processos Node.js
```

---

## 🔧 Instalação em Produção

### 1. Clonar Repositório
```bash
git clone https://github.com/Neve77/comandaflow.git
cd comandaflow
```

### 2. Instalar Dependências

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

---

## 🗄️ Configuração do Banco de Dados

### 1. Inicializar Banco de Dados
```bash
cd backend
npm run seed
```

O script `seed.js` criará:
- Base de dados SQLite (`database.db`)
- Tabelas: `users`, `clientes`, `produtos`, `pedidos`, `itens`
- Usuário admin padrão

### 2. Credenciais Padrão
```
Email: admin@comandaflow.com
Senha: admin123
```

⚠️ **IMPORTANTE:** Altere essas credenciais no primeiro acesso em produção!

---

## 🔐 Variáveis de Ambiente

### Backend (`backend/.env`)
```bash
PORT=5000
NODE_ENV=production
DB_PATH=./database/database.db
JWT_SECRET=sua_chave_secreta_aqui_minimo_32_caracteres
CORS_ORIGIN=http://seu-dominio.com
```

### Frontend (`.env.local` na raiz do frontend)
```bash
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
NEXT_PUBLIC_SOCKET_URL=https://seu-dominio.com
```

---

## ▶️ Execução em Produção

### Opção 1: PM2 (Recomendado)

**1. Iniciar Backend com PM2:**
```bash
cd backend
pm2 start server.js --name "comandaflow-api"
```

**2. Iniciar Frontend com PM2:**
```bash
cd frontend
npm run build
pm2 start npm --name "comandaflow-web" -- start
```

**3. Salvar configuração PM2:**
```bash
pm2 save
```

**4. Garantir autostart na reinicialização:**
```bash
pm2 startup
pm2 save
```

### Opção 2: Docker (Melhor Prática)

**1. Build das imagens:**
```bash
docker-compose build
```

**2. Iniciar containers:**
```bash
docker-compose up -d
```

**3. Verificar status:**
```bash
docker-compose ps
docker-compose logs -f
```

---

## 🌐 Nginx como Reverse Proxy

### Configuração do Nginx

Crie um arquivo `/etc/nginx/sites-available/comandaflow`:

```nginx
upstream backend {
    server 127.0.0.1:5000;
}

upstream frontend {
    server 127.0.0.1:3000;
}

server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    # Redirecionar HTTP para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seu-dominio.com www.seu-dominio.com;

    ssl_certificate /etc/letsencrypt/live/seu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seu-dominio.com/privkey.pem;

    # API Backend
    location /api {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Ativar site:**
```bash
sudo ln -s /etc/nginx/sites-available/comandaflow /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 🔒 SSL/TLS com Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d seu-dominio.com -d www.seu-dominio.com
sudo certbot renew --dry-run
```

---

## 📊 Monitoramento

### Verificar Processos
```bash
pm2 list
pm2 logs comandaflow-api
pm2 logs comandaflow-web
```

### Monitoramento de Recursos
```bash
pm2 monit
```

### Alertas (opcional)
```bash
pm2 install pm2-logrotate
pm2 install pm2-auto-pull
```

---

## 🔄 Backup e Recuperação

### Backup Automático do BD
```bash
# Script: backup.sh
#!/bin/bash
BACKUP_DIR="/backups/comandaflow"
mkdir -p $BACKUP_DIR
cp backend/database/database.db $BACKUP_DIR/database_$(date +%Y%m%d_%H%M%S).db

# Manter apenas últimos 7 dias
find $BACKUP_DIR -mtime +7 -delete
```

**Agendar com cron:**
```bash
0 2 * * * /path/to/backup.sh
```

---

## 🧪 Testes Finais em Produção

### 1. Verificar Backend
```bash
curl https://seu-dominio.com/api/clientes
```

Deve retornar lista de clientes em JSON.

### 2. Verificar Frontend
```bash
curl -I https://seu-dominio.com
```

Deve retornar status 200.

### 3. Testar Socket.io
Abrir navegador em `https://seu-dominio.com` e verificar console do browser.

### 4. Testar Exportação (PDF/CSV)
- Login com credenciais
- Acessar "Relatórios"
- Testar download de PDF e CSV

---

## 🛡️ Segurança em Produção

### Checklist de Segurança
- [ ] Alterar senha admin padrão
- [ ] Configurar JWT_SECRET forte (32+ caracteres)
- [ ] Usar HTTPS/SSL obrigatoriamente
- [ ] Configurar CORS apenas para domínios conhecidos
- [ ] Habilitar firewall
- [ ] Bloquear portas 5000 (backend) e 3000 (frontend)
- [ ] Usar reverse proxy (Nginx)
- [ ] Manter backups regulares
- [ ] Monitorar logs de erro
- [ ] Implementar rate limiting

### Exemplo Rate Limiting no Nginx
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

location /api {
    limit_req zone=api_limit burst=20 nodelay;
    # ... resto da configuração
}
```

---

## 📈 Performance

### Otimizações
1. **Frontend:** Usar `npm run build` para otimização de produção
2. **Backend:** Usar índices no SQLite para queries frequentes
3. **Nginx:** Habilitar gzip compression
4. **Caching:** Configurar cache de assets estáticos

### Gzip no Nginx
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
gzip_min_length 1000;
gzip_vary on;
```

---

## 🐛 Troubleshooting

### Backend não inicia
```bash
cd backend
npm install
npm run seed
node server.js
```

### Porta já em uso
```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Erro de conexão Frontend-Backend
- Verificar URL da API em `.env.local`
- Verificar CORS no backend
- Verificar firewall
- Verificar logs do Nginx

### Erro de SSL/TLS
```bash
sudo certbot renew --force-renewal
sudo systemctl restart nginx
```

---

## 📞 Suporte e Contato

- **GitHub:** https://github.com/Neve77/comandaflow
- **Issues:** https://github.com/Neve77/comandaflow/issues
- **Email:** seu-email@exemplo.com

---

## 📝 Changelog de Deploy

**v1.0.0** - 2026-01-17
- ✅ Backend Fastify com SQLite
- ✅ Frontend Next.js com Tailwind CSS
- ✅ Autenticação JWT
- ✅ Relatórios em PDF e CSV
- ✅ Sistema de clientes e produtos
- ✅ Real-time com Socket.io

---

**Última atualização:** 2026-01-17  
**Versão:** 1.0.0
