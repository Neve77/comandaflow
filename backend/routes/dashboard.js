const db = require("../db");
const { auth } = require("../middleware/auth");

async function routes(fastify) {
  // Dashboard - Overview
  fastify.get("/dashboard", { onRequest: auth }, async () => {
    const hoje = new Date().toISOString().split('T')[0];

    // Total de pedidos hoje
    const pedidosHoje = db.prepare(`
      SELECT COUNT(*) as total FROM pedidos 
      WHERE DATE(criado_em) = ?
    `).get(hoje).total;

    // Total de vendas hoje
    const vendasHoje = db.prepare(`
      SELECT SUM(total) as total FROM pedidos 
      WHERE DATE(criado_em) = ? AND status != 'cancelado'
    `).get(hoje).total || 0;

    // Clientes ativos
    const clientesAtivos = db.prepare(`
      SELECT COUNT(*) as total FROM clientes WHERE status = 'ativo'
    `).get().total;

    // Pedidos pendentes
    const pedidosPendentes = db.prepare(`
      SELECT COUNT(*) as total FROM pedidos WHERE status = 'pendente'
    `).get().total;

    // Faturamento total
    const faturamento = db.prepare(`
      SELECT SUM(total) as total FROM pedidos WHERE status != 'cancelado'
    `).get().total || 0;

    // Produtos mais vendidos
    const produtosMais = db.prepare(`
      SELECT pr.id, pr.nome, SUM(i.quantidade) as total_vendido, SUM(i.preco * i.quantidade) as total_vendas
      FROM itens i
      JOIN produtos pr ON i.produto_id = pr.id
      JOIN pedidos p ON i.pedido_id = p.id
      WHERE DATE(p.criado_em) = ? AND p.status != 'cancelado'
      GROUP BY pr.id
      ORDER BY total_vendas DESC
      LIMIT 10
    `).all(hoje);

    return {
      resumo: {
        pedidosHoje,
        vendasHoje: parseFloat(vendasHoje).toFixed(2),
        clientesAtivos,
        pedidosPendentes,
        faturamentTotal: parseFloat(faturamento).toFixed(2)
      },
      produtosMais
    };
  });

  // Dashboard - Histórico de vendas
  fastify.get("/dashboard/historico", { onRequest: auth }, async (request) => {
    const dias = request.query.dias || 7;
    const vendas = db.prepare(`
      SELECT DATE(criado_em) as data, COUNT(*) as pedidos, SUM(total) as total
      FROM pedidos
      WHERE criado_em > datetime('now', '-' || ? || ' days') AND status != 'cancelado'
      GROUP BY DATE(criado_em)
      ORDER BY data DESC
    `).all(dias);

    return { vendas, dias };
  });

  // Dashboard - Filas de espera (cozinha)
  fastify.get("/dashboard/cozinha", { onRequest: auth }, async () => {
    const filaAtiva = db.prepare(`
      SELECT p.*, c.nome as cliente_nome, COUNT(i.id) as total_itens
      FROM pedidos p
      JOIN clientes c ON p.cliente_id = c.id
      LEFT JOIN itens i ON p.id = i.pedido_id
      WHERE p.status IN ('pendente', 'preparando')
      GROUP BY p.id
      ORDER BY p.status = 'pendente' DESC, p.criado_em ASC
    `).all();

    const filaComItens = filaAtiva.map(p => {
      const itens = db.prepare(`
        SELECT i.*, pr.nome as produto_nome
        FROM itens i
        JOIN produtos pr ON i.produto_id = pr.id
        WHERE i.pedido_id = ?
      `).all(p.id);
      return { ...p, itens };
    });

    return { fila: filaComItens };
  });
}

module.exports = routes;