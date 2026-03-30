const db = require("../db");
const { auth } = require("../middleware/auth");

async function routes(fastify) {
  // Criar pedido (por pulseira)
  fastify.post("/pedido", async (req) => {
    try {
      const { pulseira, itens } = req.body;

      const cliente = db.prepare(
        "SELECT * FROM clientes WHERE pulseira = ? AND status = 'ativo'"
      ).get(pulseira);

      if (!cliente) {
        return { erro: "Cliente não encontrado" };
      }

      let total = 0;

      // Validar e calcular total
      for (const item of itens) {
        const produto = db.prepare(
          "SELECT preco FROM produtos WHERE id = ?"
        ).get(item.produto_id);

        if (!produto) {
          return { erro: `Produto ${item.produto_id} não encontrado` };
        }

        total += produto.preco * item.quantidade;
      }

      // Criar pedido
      const pedidoResult = db.prepare(`
        INSERT INTO pedidos (cliente_id, status, total, criado_em)
        VALUES (?, 'pendente', ?, CURRENT_TIMESTAMP)
      `).run(cliente.id, total);

      const pedido_id = pedidoResult.lastInsertRowid;

      // Inserir itens
      const stmtItem = db.prepare(`
        INSERT INTO itens (pedido_id, produto_id, quantidade, preco)
        VALUES (?, ?, ?, ?)
      `);

      for (const item of itens) {
        const produto = db.prepare("SELECT preco FROM produtos WHERE id = ?").get(item.produto_id);
        stmtItem.run(pedido_id, item.produto_id, item.quantidade, produto.preco);
      }

      return { ok: true, id: pedido_id, total, cliente_id: cliente.id };
    } catch (err) {
      return { erro: err.message };
    }
  });

  // Listar pedidos pendentes (para cozinha)
  fastify.get("/pedidos/pendentes", { onRequest: auth }, async () => {
    const pedidos = db.prepare(`
      SELECT p.*, c.nome as cliente_nome, c.pulseira
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      WHERE p.status = 'pendente'
      ORDER BY p.criado_em ASC
    `).all();

    // Buscar itens de cada pedido
    const pedidosComItens = pedidos.map(p => {
      const itens = db.prepare(`
        SELECT i.*, pr.nome as produto_nome
        FROM itens i
        JOIN produtos pr ON i.produto_id = pr.id
        WHERE i.pedido_id = ?
      `).all(p.id);
      return { ...p, itens };
    });

    return { pedidos: pedidosComItens };
  });

  // Obter pedido específico
  fastify.get("/pedidos/:id", { onRequest: auth }, async (request) => {
    const { id } = request.params;
    const pedido = db.prepare("SELECT * FROM pedidos WHERE id = ?").get(id);

    if (!pedido) {
      return { erro: "Pedido não encontrado" };
    }

    const itens = db.prepare(`
      SELECT i.*, pr.nome as produto_nome
      FROM itens i
      JOIN produtos pr ON i.produto_id = pr.id
      WHERE i.pedido_id = ?
    `).all(id);

    return { pedido: { ...pedido, itens } };
  });

  // Atualizar status do pedido
  fastify.put("/pedidos/:id/status", { onRequest: auth }, async (request, reply) => {
    try {
      const { id } = request.params;
      const { status } = request.body;

      db.prepare("UPDATE pedidos SET status = ? WHERE id = ?").run(status, id);

      if (status === "finalizado") {
        db.prepare("UPDATE pedidos SET finalizado_em = CURRENT_TIMESTAMP WHERE id = ?").run(id);
      }

      return { ok: true };
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Listar todos os pedidos (paginado)
  fastify.get("/pedidos", { onRequest: auth }, async (request) => {
    const limit = request.query.limit || 50;
    const offset = request.query.offset || 0;

    const pedidos = db.prepare(`
      SELECT p.*, c.nome as cliente_nome, c.pulseira
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.criado_em DESC
      LIMIT ? OFFSET ?
    `).all(limit, offset);

    const total = db.prepare("SELECT COUNT(*) as count FROM pedidos").get().count;

    return { pedidos, total, limit: parseInt(limit), offset: parseInt(offset) };
  });
}

module.exports = routes;