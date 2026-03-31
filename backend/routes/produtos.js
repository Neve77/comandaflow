const db = require("../db");
const { auth } = require("../middleware/auth");

async function routes(fastify) {
  // Listar produtos ativos
  fastify.get("/produtos", async () => {
    const produtos = db.prepare("SELECT * FROM produtos WHERE ativo = 1 ORDER BY categoria").all();
    return { produtos };
  });

  // Listar por categoria
  fastify.get("/produtos/categoria/:categoria", async (request) => {
    const { categoria } = request.params;
    const produtos = db.prepare(`
      SELECT * FROM produtos WHERE categoria = ? AND ativo = 1
      ORDER BY nome
    `).all(categoria);
    return { produtos };
  });

  // Criar produto (apenas admin)
  fastify.post("/produtos", { onRequest: auth }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") {
        return reply.code(403).send({ erro: "Acesso negado" });
      }

      const { nome, preco, categoria } = req.body;
      const stmt = db.prepare(`
        INSERT INTO produtos (nome, preco, categoria, ativo)
        VALUES (?, ?, ?, 1)
      `);
      const result = stmt.run(nome, preco, categoria);

      return { id: result.lastInsertRowid, nome, preco, categoria, ativo: 1 };
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Atualizar produto (apenas admin)
  fastify.put("/produtos/:id", { onRequest: auth }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") {
        return reply.code(403).send({ erro: "Acesso negado" });
      }

      const { id } = req.params;
      const { nome, preco, categoria, ativo } = req.body;

      db.prepare(`
        UPDATE produtos
        SET nome = ?, preco = ?, categoria = ?, ativo = ?
        WHERE id = ?
      `).run(nome, preco, categoria, ativo ? 1 : 0, id);

      return { ok: true };
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Deletar produto (apenas admin) - soft delete
  fastify.delete("/produtos/:id", { onRequest: auth }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") {
        return reply.code(403).send({ erro: "Acesso negado" });
      }

      const { id } = req.params;

      // Verificar se produto existe
      const produto = db.prepare("SELECT * FROM produtos WHERE id = ?").get(id);
      if (!produto) {
        return reply.code(404).send({ erro: "Produto não encontrado" });
      }

      // Soft delete: marcar como inativo
      db.prepare("UPDATE produtos SET ativo = 0 WHERE id = ?").run(id);

      return { ok: true, mensagem: "Produto deletado com sucesso" };
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });
}

module.exports = routes;
