# Changelog

Todas as mudanças significativas neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto segue [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-30

### ✨ Adicionado
- Autenticação JWT com bcrypt
- Sistema de gerenciamento de pedidos
- Interface Garçom para criar pedidos
- Interface Cozinha com atualização em tempo real (WebSocket)
- Dashboard Admin com estatísticas
- CRUD de produtos
- CRUD de clientes
- Componentes UI reutilizáveis (Button, Card, Modal, etc)
- Tailwind CSS com tema customizado
- Banco de dados SQLite com seeding
- CORS habilitado
- API REST completa

### 🎨 Design
- Dark mode ready
- Animações suaves (fade-in, slide-up, float)
- Responsive design (mobile-first)
- Componentes com estados hover e active
- Custom scrollbar

### 📚 Documentação
- README.md completo
- GETTING_STARTED.md
- Documentação de API
- Guia de contribuição
- Código de Conduta

### 🔒 Segurança
- JWT tokens com expiração 24h
- Senha hasheada com bcrypt
- Validações de entrada
- CORS configurado
- Middleware de autenticação

### 🚀 Performance
- SQLite para dados locais
- WebSocket para comunicação em tempo real
- Componentes otimizados
- CSS minificado com Tailwind
- Next.js com otimizações de build

## [Unreleased]

### 🚧 Em Desenvolvimento
- Relatórios com gráficos (Chart.js)
- Modo dark theme
- Notificações push
- App mobile (React Native)
- Integração com impressoras
- Sistema de descontos/cupons
- Autenticação com 2FA
- Backup automático
- Analytics avançado
- Testes unitários e e2e

---

## Como Usamos este Changelog

- **Adicionado** para novas funcionalidades
- **Alterado** para mudanças em funcionalidades existentes
- **Deprecado** para funcionalidades que serão removidas em breve
- **Removido** para funcionalidades removidas
- **Corrigido** para correções de bugs
- **Segurança** para vulnerabilidades
