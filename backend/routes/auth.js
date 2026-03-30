const bcrypt = require('bcrypt');
const db = require('../db');
const { gerarToken } = require('../middleware/auth');
const { errors } = require('../errors');

module.exports = async (fastify) => {
  /**
   * POST /auth/registro - Registrar novo usuário
   */
  fastify.post('/auth/registro', async (request) => {
    const { nome, email, senha } = request.body;

    // Validar dados
    if (!nome || !email || !senha) {
      throw errors.validationError('Dados incompletos: nome, email e senha são obrigatórios');
    }

    // Verificar se email já existe
    const usuarioExistente = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (usuarioExistente) {
      throw errors.conflictError('Email');
    }

    try {
      // Hashear senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // Inserir usuário
      const stmt = db.prepare(
        'INSERT INTO users (nome, email, senha, role) VALUES (?, ?, ?, ?)'
      );
      const result = stmt.run(nome, email, senhaHash, 'garcom');

      const usuario = {
        id: result.lastInsertRowid,
        nome,
        email,
        role: 'garcom'
      };

      const token = gerarToken(usuario);

      return { token, usuario };
    } catch (err) {
      throw errors.internalError(`Erro ao registrar usuário: ${err.message}`);
    }
  });

  /**
   * POST /auth/login - Fazer login
   */
  fastify.post('/auth/login', async (request) => {
    const { email, senha } = request.body;

    // Validar dados
    if (!email || !senha) {
      throw errors.validationError('Email e senha são obrigatórios');
    }

    try {
      // Buscar usuário
      const usuario = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (!usuario) {
        throw errors.notFound('Usuário');
      }

      // Comparar senha
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      if (!senhaValida) {
        throw errors.unauthorized('Senha incorreta');
      }

      // Gerar token
      const token = gerarToken(usuario);

      return {
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          role: usuario.role
        }
      };
    } catch (err) {
      // Re-lançar erros de aplicação
      if (err.name === 'AppError') {
        throw err;
      }
      throw errors.internalError(`Erro ao fazer login: ${err.message}`);
    }
  });
};
