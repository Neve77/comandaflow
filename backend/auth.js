const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("./db");

const SECRET = "segredo";

async function login(req, reply) {
  const { email, senha } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) return reply.code(401).send({ erro: "Usuário não encontrado" });

  const ok = await bcrypt.compare(senha, user.senha);
  if (!ok) return reply.code(401).send({ erro: "Senha inválida" });

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);

  return { token };
}

module.exports = { login };