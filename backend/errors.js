/**
 * Classe customizada para erros da aplicação
 *
 * Padroniza tratamento de erros em toda a API
 * Facilita diferenciação entre erros de negócio e sistema
 */

class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Capturar stack trace se suportado
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Converter para objeto JSON para resposta HTTP
   */
  toJSON() {
    return {
      erro: this.message,
      code: this.code,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
      ...(this.details && { details: this.details }),
    };
  }
}

/**
 * Erros comuns pré-construídos
 */
const errors = {
  // Auth
  unauthorized: (message = 'Não autorizado') =>
    new AppError(message, 401, 'UNAUTHORIZED'),

  forbidden: (message = 'Acesso proibido') =>
    new AppError(message, 403, 'FORBIDDEN'),

  invalidToken: () =>
    new AppError('Token inválido ou expirado', 401, 'INVALID_TOKEN'),

  tokenNotProvided: () =>
    new AppError('Token não fornecido', 401, 'TOKEN_NOT_PROVIDED'),

  // Validation
  validationError: (message, details = null) =>
    new AppError(message, 400, 'VALIDATION_ERROR', details),

  // Resources
  notFound: (resource = 'Recurso') =>
    new AppError(`${resource} não encontrado`, 404, 'NOT_FOUND'),

  conflictError: (resource = 'Recurso') =>
    new AppError(`${resource} já existe`, 409, 'CONFLICT'),

  // Server
  internalError: (message = 'Erro interno do servidor') =>
    new AppError(message, 500, 'INTERNAL_ERROR'),
};

module.exports = { AppError, errors };
