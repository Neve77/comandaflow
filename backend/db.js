const Database = require('better-sqlite3');
const path = require('path');
const config = require('./config');

const db = new Database(config.database.path);

// Ativar chaves estrangeiras
db.pragma('foreign_keys = ON');

// Usuários
db.prepare(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT DEFAULT 'garcom',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Clientes
db.prepare(`
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pulseira TEXT UNIQUE,
  nome TEXT,
  cpf TEXT,
  telefone TEXT,
  status TEXT DEFAULT 'ativo',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Produtos
db.prepare(`
CREATE TABLE IF NOT EXISTS produtos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  preco REAL NOT NULL,
  categoria TEXT,
  ativo INTEGER DEFAULT 1,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
)
`).run();

// Pedidos
db.prepare(`
CREATE TABLE IF NOT EXISTS pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cliente_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pendente',
  total REAL DEFAULT 0,
  anotacoes TEXT,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  finalizado_em DATETIME,
  FOREIGN KEY(cliente_id) REFERENCES clientes(id)
)
`).run();

// Adicionar coluna anotacoes se não existir (para migração)
try {
  db.prepare(`ALTER TABLE pedidos ADD COLUMN anotacoes TEXT`).run();
} catch (err) {
  // Coluna já existe, ignorar erro
}

// Itens de Pedido
db.prepare(`
CREATE TABLE IF NOT EXISTS itens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER DEFAULT 1,
  preco REAL NOT NULL,
  FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY(produto_id) REFERENCES produtos(id)
)
`).run();

// Comandas
db.prepare(`
CREATE TABLE IF NOT EXISTS comandas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  numero TEXT UNIQUE NOT NULL,
  cliente_id INTEGER,
  status TEXT DEFAULT 'aberta',
  observacao TEXT,
  data_abertura TEXT DEFAULT CURRENT_TIMESTAMP,
  data_fechamento TEXT,
  valor_total REAL DEFAULT 0,
  FOREIGN KEY(cliente_id) REFERENCES clientes(id)
)
`).run();

module.exports = db;
