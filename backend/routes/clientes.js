const db = require("../db");
const { auth } = require("../middleware/auth");

async function routes(fastify) {
  // Listar clientes ativos
  fastify.get("/clientes", { onRequest: auth }, async () => {
    const clientes = db.prepare("SELECT * FROM clientes WHERE status = 'ativo'").all();
    return { clientes };
  });

  // Obter cliente por pulseira
  fastify.get("/clientes/pulseira/:pulseira", { onRequest: auth }, async (request) => {
    const { pulseira } = request.params;
    const cliente = db.prepare("SELECT * FROM clientes WHERE pulseira = ?").get(pulseira);

    if (!cliente) {
      return { erro: "Cliente não encontrado" };
    }

    // Buscar pedidos deste cliente
    const pedidos = db.prepare(`
      SELECT p.*, COUNT(ip.id) as total_itens
      FROM pedidos p
      LEFT JOIN itens ip ON p.id = ip.pedido_id
      WHERE p.cliente_id = ? AND p.status != 'finalizado'
      GROUP BY p.id
    `).all(cliente.id);

    return { cliente, pedidos };
  });

  // Criar cliente
  fastify.post("/clientes", { onRequest: auth }, async (req, reply) => {
    try {
      const { nome, cpf, telefone, pulseira } = req.body;

      const existente = db.prepare(
        "SELECT * FROM clientes WHERE pulseira = ? AND status = 'ativo'"
      ).get(pulseira);

      if (existente) {
        return reply.code(400).send({ erro: "Pulseira já em uso" });
      }

      const stmt = db.prepare(`
        INSERT INTO clientes (nome, cpf, telefone, pulseira, status)
        VALUES (?, ?, ?, ?, 'ativo')
      `);
      const result = stmt.run(nome, cpf, telefone, pulseira);

      return { id: result.lastInsertRowid, nome, cpf, telefone, pulseira, status: "ativo" };
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Buscar pedidos do cliente
  fastify.get("/clientes/:id/pedidos", { onRequest: auth }, async (request) => {
    const { id } = request.params;
    const pedidos = db.prepare(`
      SELECT p.*, GROUP_CONCAT(pr.nome, ', ') as itens_nomes
      FROM pedidos p
      LEFT JOIN itens ip ON p.id = ip.pedido_id
      LEFT JOIN produtos pr ON ip.produto_id = pr.id
      WHERE p.cliente_id = ?
      GROUP BY p.id
      ORDER BY p.criado_em DESC
    `).all(id);
    return { pedidos };
  });

  // Deletar cliente (apenas admin)
  fastify.delete("/clientes/:id", { onRequest: auth }, async (req, reply) => {
    try {
      if (req.user.role !== "admin") {
        return reply.code(403).send({ erro: "Acesso negado" });
      }

      const { id } = req.params;

      // Verificar se cliente existe
      const cliente = db.prepare("SELECT * FROM clientes WHERE id = ?").get(id);
      if (!cliente) {
        return reply.code(404).send({ erro: "Cliente não encontrado" });
      }

      // Mover pedidos para status 'cancelado' ao invés de deletar
      db.prepare("UPDATE pedidos SET status = 'cancelado' WHERE cliente_id = ?").run(id);

      // Deletar cliente
      db.prepare("DELETE FROM clientes WHERE id = ?").run(id);

      return { ok: true, mensagem: "Cliente deletado com sucesso" };
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });
}

module.exports = routes;
