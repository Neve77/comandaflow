# 🍽️ ComandaFlow

> **Sistema de Gerenciamento de Comandas Digital com Atualização em Tempo Real**

[![Node.js](https://img.shields.io/badge/Node.js-14+-green)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-latest-black)](https://nextjs.org/)
[![Fastify](https://img.shields.io/badge/Fastify-4.0-blue)](https://www.fastify.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

## 🎯 Características Principais

- ✅ **Dashboard em Tempo Real** - Acompanhamento de pedidos via WebSocket (Socket.io)
- ✅ **Autenticação Segura** - JWT com bcrypt
- ✅ **Interface Moderna** - Tailwind CSS com animações smooth
- ✅ **Responsivo** - Mobile-first, funciona em tablets e desktops
- ✅ **Componentes Reutilizáveis** - Biblioteca de componentes profissional
- ✅ **Banco de Dados Robusto** - SQLite com dados seeded
- ✅ **API REST** - Documentada e escalável
- ✅ **CORS Habilitado** - Pronto para múltiplos clientes

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (Next.js)               │
│  ├─ Garçom Interface (criar pedidos)               │
│  ├─ Cozinha Interface (acompanhar em tempo real)   │
│  ├─ Admin Dashboard (estatísticas e gerenciamento) │
│  └─ Componentes UI (Button, Card, Modal, etc)     │
└──────────────┬──────────────────────────────────────┘
               │ HTTP + WebSocket
┌──────────────┴──────────────────────────────────────┐
│                 Backend (Fastify)                   │
│  ├─ /auth - Autenticação JWT                       │
│  ├─ /pedidos - Gerenciamento de pedidos            │
│  ├─ /produtos - Catálogo de produtos              │
│  ├─ /clientes - Dados de clientes/mesas           │
│  ├─ /dashboard - Estatísticas                      │
│  └─ Socket.io - Comunicação em tempo real         │
└──────────────┬──────────────────────────────────────┘
               │
┌──────────────┴──────────────────────────────────────┐
│              SQLite Database                        │
│  ├─ users (autenticação)                           │
│  ├─ clientes (mesas/clientes)                      │
│  ├─ produtos (cardápio)                            │
│  ├─ pedidos (comanda)                              │
│  └─ itens (itens da comanda)                       │
└─────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### Pré-requisitos
- **Node.js** 14+ ([Download](https://nodejs.org/))
- **npm** ou **yarn**
- **Git**

### 1. Clonar Repositório

```bash
git clone https://github.com/seu-usuario/comandaflow.git
cd comandaflow
```

### 2. Configurar Backend

```bash
cd backend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Popular banco de dados com dados de teste
npm run seed

# Iniciar servidor (porta 4000)
npm run dev
```

**Output esperado:**
```
✅ Servidor rodando na porta 4000
✅ WebSocket conectado
✅ CORS habilitado
```

### 3. Configurar Frontend

Abra outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Iniciar Next.js (porta 3000)
npm run dev
```

**Output esperado:**
```
▲ Next.js ready - started server on 0.0.0.0:3000
```

### 4. Acessar Aplicação

Abra seu navegador: **http://localhost:3000**

## 🔐 Credenciais de Teste

Após rodar `npm run seed`, use estas credenciais:

| Papel | Email | Senha | Acesso |
|-------|-------|-------|--------|
| Admin | `admin@test.com` | `admin123` | Dashboard, Gerenciamento |
| Garçom | `garcom@test.com` | `garcom123` | Criar pedidos |
| Cozinha | `cozinha@test.com` | `cozinha123` | Visualizar pedidos |

## 📁 Estrutura do Projeto

```
comandaflow/
├── backend/
│   ├── server.js              # 🎯 Entrada do servidor
│   ├── db.js                  # 🗄️ Configuração SQLite
│   ├── seed.js                # 🌱 Dados de teste
│   ├── package.json
│   ├── .env                   # ⚠️ NÃO versionar
│   ├── .env.example           # ✅ Template
│   ├── middleware/
│   │   └── auth.js            # 🔐 JWT middleware
│   └── routes/
│       ├── auth.js            # Autenticação
│       ├── pedidos.js         # CRUD Pedidos
│       ├── produtos.js        # CRUD Produtos
│       ├── clientes.js        # CRUD Clientes
│       ├── dashboard.js       # Estatísticas
│       ├── fechamento.js      # Fechar comanda
│       └── relatorios.js      # Relatórios
│
├── frontend/
│   ├── pages/
│   │   ├── index.js           # Home + Login
│   │   ├── garcom.js          # Interface Garçom
│   │   ├── cozinha.js         # Interface Cozinha
│   │   ├── admin.js           # Dashboard Admin
│   │   ├── relatorios.js      # Página Relatórios
│   │   └── _app.js            # Root app
│   ├── components/            # 🎨 Componentes UI
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Alert.js
│   │   ├── Badge.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   ├── Loading.js
│   │   ├── DashboardCard.js
│   │   └── Header.js
│   ├── services/
│   │   ├── api.js             # Cliente HTTP
│   │   └── socket.js          # Cliente WebSocket
│   ├── styles/
│   │   └── globals.css        # Estilos globais
│   ├── tailwind.config.js     # Config Tailwind
│   ├── postcss.config.js
│   ├── package.json
│   ├── .env.local             # ⚠️ NÃO versionar
│   └── .env.example           # ✅ Template
│
├── .gitignore                 # Arquivos ignorados
├── README.md                  # Este arquivo
├── GETTING_STARTED.md         # Guia detalhado
└── package.json               # (opcional) monorepo
```

## 📚 Documentação da API

### Autenticação

#### Registrar
```bash
POST /auth/registro
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@example.com",
    "role": "garcom"
  }
}
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "senha": "admin123"
}
```

### Produtos

#### Listar
```bash
GET /produtos
Authorization: Bearer {token}
```

#### Criar (Admin)
```bash
POST /produtos
Authorization: Bearer {token}
Content-Type: application/json

{
  "nome": "Pizza Margherita",
  "preco": 35.00,
  "categoria": "Pizza"
}
```

### Pedidos

#### Criar Pedido
```bash
POST /pedido
Content-Type: application/json

{
  "pulseira": "MESA001",
  "itens": [
    { "produto_id": 1, "quantidade": 2 },
    { "produto_id": 5, "quantidade": 1 }
  ]
}
```

#### Listar Pendentes
```bash
GET /pedidos/pendentes
Authorization: Bearer {token}
```

#### Atualizar Status
```bash
PUT /pedidos/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "preparando"
}
```

**Status válidos:** `pendente`, `preparando`, `pronto`, `entregue`, `cancelado`

## 🎨 Componentes UI

### Button
```jsx
<Button variant="primary" size="md">
  Clique aqui
</Button>
```

Variantes: `primary`, `secondary`, `danger`, `success`, `ghost`

### Card
```jsx
<Card hover border>
  <CardHeader>
    <CardTitle>Meu Card</CardTitle>
  </CardHeader>
  <CardContent>Conteúdo...</CardContent>
</Card>
```

### Alert
```jsx
<Alert type="success" onClose={() => setOpen(false)}>
  Operação concluída!
</Alert>
```

Tipos: `error`, `success`, `warning`, `info`

### Modal
```jsx
<Modal 
  isOpen={open}
  onClose={() => setOpen(false)}
  title="Confirmar Ação"
>
  Tem certeza?
</Modal>
```

## 🔧 Variáveis de Ambiente

### Backend (`.env`)
```bash
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
JWT_SECRET=seu-segredo-muito-seguro-em-producao
DATABASE=database.db
LOG_LEVEL=info
```

### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NODE_ENV=development
```

**⚠️ Importante:**
- Nunca versione `.env` ou `.env.local`
- Altere `JWT_SECRET` em produção
- Use valores diferentes por ambiente

## 🐛 Troubleshooting

### Erro: "Cannot find module '@fastify/cors'"
```bash
cd backend && npm install
```

### Erro: "Connection refused"
- Verifique se backend está rodando: `npm run dev`
- Verifique porta 4000: não deve estar em uso
- Verifique `.env.local` do frontend

### WebSocket não conecta
- Verifique console do navegador (F12)
- Verifique CORS no backend
- Reinicie servidor e navegador

### Banco de dados corrompido
```bash
# Remover banco antigo
rm backend/database.db

# Recriar e popular
npm run seed
```

## 🚀 Deploy em Produção

### Variáveis de Ambiente

**Backend:**
```bash
NODE_ENV=production
PORT=4000
JWT_SECRET=gerar-nova-chave-secreta-forte
DATABASE=/opt/data/database.db
```

**Frontend:**
```bash
NEXT_PUBLIC_API_URL=https://api.seu-dominio.com
NEXT_PUBLIC_SOCKET_URL=https://api.seu-dominio.com
NODE_ENV=production
```

### Docker (Opcional)

```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY backend .
RUN npm install --production
EXPOSE 4000
CMD ["npm", "run", "dev"]
```

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📋 Roadmap

- [x] Autenticação JWT
- [x] CRUD Pedidos
- [x] WebSocket em tempo real
- [x] Dashboard Admin
- [ ] Relatórios com gráficos
- [ ] Modo dark
- [ ] Notificações push
- [ ] Integração impressoras
- [ ] App mobile (React Native)
- [ ] Backup automático

## 📄 Licença

Este projeto está licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

[![GitHub Avatar](https://github.com/Neve77.png?size=100)](https://github.com/Neve77)

**Neve77** - [@Neve77](https://github.com/Neve77)

## 💬 Suporte

- 📧 Email: [igorribm@gmail.com](mailto:igorribm@gmail.com)
- 🐦 Twitter: [@nevevelr7](https://twitter.com/nevevelr7)
- 💬 Discord: nevevlr#7

---

**Feito com ❤️ usando Fastify + Next.js + Tailwind CSS + SQLite**

⭐ Se gostou, deixe uma star no repositório!
