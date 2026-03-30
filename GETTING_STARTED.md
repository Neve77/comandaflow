# 🍽️ ComandaFlow - Guia de Início Rápido

## ✨ O que foi modernizado e implementado

### 🎨 **Frontend - CSS e Design**
- ✅ **Tailwind CSS Avançado**: Tema customizado com cores, animações e shadows
- ✅ **Componentes Reutilizáveis**: Button, Card, Alert, Badge, Input, Modal, Loading, DashboardCard
- ✅ **Animações Suaves**: fade-in, slide-up, float, pulse
- ✅ **Design Responsivo**: Mobile-first com grid layouts
- ✅ **Efeitos Glass & Gradients**: Backgrounds modernos e efeitos visuais
- ✅ **Dark Mode Ready**: Estrutura pronta para tema escuro

### 🔧 **Backend - Estabilidade**
- ✅ **CORS Configurado**: @fastify/cors instalado e registrado
- ✅ **Validações de Segurança**: Tratamento de null checks em pedidos
- ✅ **Autenticação JWT**: Middleware corrigido com reply.code()
- ✅ **WebSocket em Produção**: Socket.io com broadcast correto
- ✅ **Banco de Dados Ligado**: SQLite com seeding automático

### 🗄️ **Dados de Teste**
- ✅ **Usuários de Teste**: Admin, Garçom, Cozinha
- ✅ **20+ Produtos**: Categorias variadas (Bebidas, Pizzas, Lanches, etc)
- ✅ **Clientes de Teste**: Mesas e usuários fictícios

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js 14+ instalado
- npm ou yarn

### 1️⃣ Instalação e Configuração

#### Backend
```bash
cd backend
npm install
npm run seed          # Popula banco com dados de teste
npm run dev          # Inicia servidor na porta 4000
```

#### Frontend (em outro terminal)
```bash
cd frontend
npm install
npm run dev          # Inicia Next.js na porta 3000
```

### 2️⃣ Acessar a Aplicação

Abra seu navegador:
```
http://localhost:3000
```

### 3️⃣ Fazer Login com Credenciais de Teste

**Administrador:**
- Email: `admin@test.com`
- Senha: `admin123`

**Garçom:**
- Email: `garcom@test.com`
- Senha: `garcom123`

**Cozinha:**
- Email: `cozinha@test.com`
- Senha: `cozinha123`

---

## 🎯 Funcionalidades Principais

### 👨‍💼 **Módulo Garçom**
- Visualizar clientes (mesas)
- Adicionar produtos ao carrinho
- Criar pedidos por pulseira
- Acompanhar status em tempo real
- Buscar e filtrar produtos

### 👨‍🍳 **Módulo Cozinha**
- Fila de pedidos em tempo real (via WebSocket)
- Mudar status: Pendente → Preparando → Pronto → Entregue
- Filtrar por status
- Visualizar itens do pedido

### ⚙️ **Módulo Admin**
- Dashboard com estatísticas
- Gerenciar produtos (criar, editar)
- Gerenciar clientes
- Histórico de pedidos
- Relatórios (em desenvolvimento)

---

## 🏗️ Estrutura de Pastas

```
comandaflow/
├── backend/
│   ├── server.js              # Servidor Fastify + Socket.io
│   ├── db.js                  # Configuração SQLite
│   ├── seed.js                # Dados de teste
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── routes/
│   │   ├── auth.js            # Autenticação
│   │   ├── pedidos.js         # Gerenciar pedidos
│   │   ├── produtos.js        # Gerenciar produtos
│   │   ├── clientes.js        # Gerenciar clientes
│   │   ├── dashboard.js       # Estatísticas
│   │   ├── fechamento.js      # Fechar comanda
│   │   └── relatorios.js      # Relatórios
│   ├── package.json
│   └── database.db            # Banco SQLite
│
├── frontend/
│   ├── pages/
│   │   ├── index.js           # Home/Login (MODERNIZADO)
│   │   ├── garcom.js          # Interface garçom
│   │   ├── cozinha.js         # Interface cozinha
│   │   ├── admin.js           # Dashboard admin
│   │   ├── relatorios.js      # Relatórios
│   │   └── _app.js
│   ├── components/            # Componentes reutilizáveis (NOVO)
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Alert.js
│   │   ├── Badge.js
│   │   ├── Header.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   ├── Loading.js
│   │   ├── DashboardCard.js
│   │   └── index.js
│   ├── services/
│   │   ├── api.js             # Cliente HTTP
│   │   └── socket.js          # Cliente WebSocket
│   ├── styles/
│   │   └── globals.css        # Estilos globais (MODERNIZADO)
│   ├── tailwind.config.js     # Tailwind config (MODERNIZADO)
│   ├── postcss.config.js
│   ├── .env.local             # Variáveis de ambiente
│   └── package.json
│
└── README.md
```

---

## 🔌 Variáveis de Ambiente

### Backend (`.env`)
```
NODE_ENV=development
PORT=4000
HOST=0.0.0.0
JWT_SECRET=seu-segredo-super-secreto-mude-em-producao
DATABASE=database.db
LOG_LEVEL=info
```

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
NODE_ENV=development
```

---

## 🎨 Customizações CSS Disponíveis

### Classes Tailwind Customizadas
```css
.btn-primary          /* Botão principal */
.btn-secondary        /* Botão secundário */
.card                 /* Card padrão */
.card-hover          /* Card com hover effect */
.input-field         /* Input customizado */
.badge               /* Badge padrão */
.gradient-text       /* Texto com gradiente */
.glass               /* Efeito glass morphism */
.alert               /* Alerta padrão */
.alert-error         /* Alerta de erro */
.alert-success       /* Alerta de sucesso */
```

### Animações Disponíveis
```css
animate-fade-in      /* Fade in 0.5s */
animate-slide-up     /* Slide up 0.5s */
animate-pulse-soft   /* Pulse suave 2s */
animate-float        /* Float up/down 3s */
```

---

## 🚨 Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro de Conexão CORS
- Verifique se backend está rodando: `http://localhost:4000`
- Verifique `.env.local` do frontend

### Banco de dados não atualiza
```bash
npm run seed        # Reseed dados
```

### WebSocket não conecta
- Verifique se Socket.io está ativo no backend
- Verifique console do navegador para erros

---

## 📝 Próximas Melhorias Sugeridas

- [ ] Autenticação com 2FA
- [ ] Relatórios com gráficos (Chart.js)
- [ ] Modo dark theme
- [ ] Notificações push
- [ ] Upload de imagens para produtos
- [ ] Sistema de descontos/cupons
- [ ] Integração com impressoras
- [ ] Backup automático do banco
- [ ] Analytics avançado
- [ ] Testes unitários

---

## 📞 Suporte

Para dúvidas ou bugs, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando Fastify + Next.js + Tailwind CSS**
