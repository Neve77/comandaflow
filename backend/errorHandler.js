/**
 * Middleware de tratamento centralizado de erros
 *
 * Captura todos os erros da aplicação
 * Retorna resposta padronizada com status correto
 */

const { AppError } = require('./errors');

const errorHandler = (err, request, reply) => {
  // AppError (erros conhecidos)
  if (err instanceof AppError) {
    return reply.code(err.statusCode).send(err.toJSON());
  }

  // Erro de validação do Fastify
  if (err.statusCode === 400 && err.validation) {
    return reply.code(400).send({
      erro: 'Dados inválidos',
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      timestamp: new Date().toISOString(),
      details: err.validation,
    });
  }

  // Erro genérico (não-previsto)
  console.error('❌ Erro não tratado:', {
    message: err.message,
    stack: err.stack,
    url: request.url,
    method: request.method,
  });

  reply.code(500).send({
    erro: 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorHandler;
