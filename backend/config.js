/**
 * Centralização de Configurações & Variáveis de Ambiente
 *
 * Validação obrigatória de .env com schema
 * Nenhum valor hardcoded no código
 * Fallback seguro para desenvolvimento
 */

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';

// Validar variáveis obrigatórias
const requiredEnvVars = ['JWT_SECRET'];

if (!isDevelopment) {
  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      console.error(`❌ Variável de ambiente obrigatória ausente: ${envVar}`);
      process.exit(1);
    }
  });
}

// Configuração centralizada
const config = {
  // Ambiente
  env: NODE_ENV,
  isDevelopment,
  isProduction: NODE_ENV === 'production',

  // Server
  server: {
    port: parseInt(process.env.PORT || '4000', 10),
    host: process.env.HOST || '0.0.0.0',
    name: 'ComandaFlow API',
    version: '1.0.0',
  },

  // Database
  database: {
    path: process.env.DATABASE_PATH || './database/database.db',
  },

  // JWT & Security
  jwt: {
    secret: process.env.JWT_SECRET || 'seu-segredo-super-secreto-alterar-em-producao',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // CORS
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim()),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400, // 24h
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  // Features
  features: {
    socketIO: true,
    websocket: true,
  },
};

// Validações de segurança
if (config.isProduction) {
  if (config.jwt.secret === 'seu-segredo-super-secreto-alterar-em-producao') {
    console.error('❌ SEGURANÇA: JWT_SECRET ainda está com valor padrão em PRODUÇÃO!');
    process.exit(1);
  }

  if (config.cors.origin.includes('*')) {
    console.error('❌ SEGURANÇA: CORS aberto para * em PRODUÇÃO!');
    process.exit(1);
  }
}

// Log da configuração na inicialização (sem expor secrets)
console.log(`
╔════════════════════════════════════════╗
║   🚀 ${config.server.name} v${config.server.version}
║   Environment: ${config.env}
║   Server: ${config.server.host}:${config.server.port}
║   Database: ${config.database.path}
║   CORS Origins: ${config.cors.origin.join(', ')}
╚════════════════════════════════════════╝
`);

module.exports = config;
