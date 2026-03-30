#!/bin/bash

# Script para preparar projeto para GitHub

echo "📦 Preparando ComandaFlow para GitHub..."

# Remover node_modules se existir
echo "🗑️  Limpando node_modules..."
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Remover banco de dados (será recriad com seed)
echo "🗑️  Removendo database.db..."
rm -f backend/database.db

# Remover arquivos de lock (opcional - deixa para rebuild com versões exatas)
# rm -f backend/package-lock.json
# rm -f frontend/package-lock.json

# Adicionar arquivos ao git
echo "📝 Adicionando arquivos ao git..."
git add .

# Mostrar status
echo ""
echo "✅ Preparação concluída!"
echo ""
echo "📋 Próximos passos:"
echo "1. Revisar as mudanças com: git diff --cached"
echo "2. Fazer commit: git commit -m 'Initial commit: ComandaFlow v1.0.0'"
echo "3. Fazer push: git push -u origin main"
echo ""
echo "⚠️  Certifique-se de que:"
echo "  • .gitignore contém node_modules, .env, *.db"
echo "  • README.md está presente e atualizado"
echo "  • LICENSE está incluído"
echo "  • CONTRIBUTING.md foi revisado"
echo ""

git status
