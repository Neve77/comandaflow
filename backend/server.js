const fastify = require('fastify')({ logger: true });
const { Server } = require("socket.io");
const db = require('./db');
const config = require('./config');
const errorHandler = require('./errorHandler');
const { registerSocketHandlers } = require('./socketHandlers');

// Registrar rotas
fastify.register(require('@fastify/cors'), config.cors);

fastify.register(require('./routes/auth'));
fastify.register(require('./routes/clientes'));
fastify.register(require('./routes/produtos'));
fastify.register(require('./routes/pedidos'));
fastify.register(require('./routes/fechamento'));
fastify.register(require('./routes/dashboard'));
fastify.register(require('./routes/relatorios'));

// Middleware de erro centralizado
fastify.setErrorHandler(errorHandler);

let io;

const start = async () => {
  try {
    await fastify.listen({ port: config.server.port, host: config.server.host });

    io = new Server(fastify.server, {
      cors: config.cors,
    });

    // Registrar handlers de socket para cada nova conexão
    io.on("connection", (socket) => {
      registerSocketHandlers(socket, db, io);
    });

    // Exportar io para outros módulos
    module.exports.io = io;

    console.log(`✅ Servidor rodando na porta ${config.server.port}`);
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start();

// Exportar io para uso em outras partes se necessário
module.exports = { fastify, io };
