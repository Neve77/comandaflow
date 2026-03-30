const jwt = require('jsonwebtoken');
const config = require('../config');
const { errors } = require('../errors');

/**
 * Middleware de autenticação JWT
 * Valida o token no header Authorization: Bearer <token>
 */
const auth = async (request, reply) => {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw errors.tokenNotProvided();
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw errors.invalidToken();
    }

    // Verificar token
    const decoded = jwt.verify(token, config.jwt.secret);
    request.user = decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw errors.invalidToken();
    }
    throw err;
  }
};

/**
 * Gerar novo JWT token
 */
const gerarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

module.exports = { auth, gerarToken };
