const db = require("../db");
const { auth } = require("../middleware/auth");

async function routes(fastify) {
  // Buscar cliente por pulseira para fechamento
  fastify.get("/fechamento/:pulseira", { onRequest: auth }, async (request, reply) => {
    const { pulseira } = request.params;

    const cliente = db.prepare("SELECT * FROM clientes WHERE pulseira = ?").get(pulseira);
    if (!cliente) {
      return reply.code(404).send({ erro: "Cliente não encontrado" });
    }

    // Buscar pedidos não finalizados
    const pedidos = db.prepare(`
      SELECT p.*, COUNT(i.id) as total_itens, SUM(i.preco * i.quantidade) as valor_total
      FROM pedidos p
      LEFT JOIN itens i ON p.id = i.pedido_id
      WHERE p.cliente_id = ? AND p.status != 'finalizado'
      GROUP BY p.id
    `).all(cliente.id);

    // Calcular total geral
    const totalGeral = db.prepare(`
      SELECT SUM(i.preco * i.quantidade) as total
      FROM itens i
      JOIN pedidos p ON i.pedido_id = p.id
      WHERE p.cliente_id = ? AND p.status != 'finalizado'
    `).get(cliente.id).total || 0;

    return {
      cliente,
      pedidos,
      totalGeral: parseFloat(totalGeral).toFixed(2)
    };
  });

  // Finalizar comanda (fechar pedidos)
  fastify.post("/fechar", async (req, reply) => {
    try {
      const { pulseira } = req.body;

      const cliente = db.prepare(
        "SELECT * FROM clientes WHERE pulseira = ? AND status = 'ativo'"
      ).get(pulseira);

      if (!cliente) {
        return reply.code(404).send({ erro: "Cliente não encontrado" });
      }

      // Atualizar todos os pedidos do cliente para finalizado
      db.prepare(`
        UPDATE pedidos
        SET status = 'finalizado', finalizado_em = CURRENT_TIMESTAMP
        WHERE cliente_id = ? AND status != 'finalizado'
      `).run(cliente.id);

      // Liberar pulseira (cambiar status para inativo)
      db.prepare("UPDATE clientes SET status = 'inativo' WHERE id = ?").run(cliente.id);

      return {
        ok: true,
        mensagem: `Comanda fechada com sucesso. Pulseira ${pulseira} liberada.`,
        cliente_id: cliente.id
      };
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Listar comandas ativas (para gerenciamento)
  fastify.get("/fechamento", { onRequest: auth }, async () => {
    const comandas = db.prepare(`
      SELECT c.*, COUNT(p.id) as total_pedidos, SUM(p.total) as total_gasto
      FROM clientes c
      LEFT JOIN pedidos p ON c.id = p.cliente_id AND p.status != 'finalizado'
      WHERE c.status = 'ativo'
      GROUP BY c.id
      ORDER BY c.criado_em DESC
    `).all();

    return { comandas };
  });
}

module.exports = routes;