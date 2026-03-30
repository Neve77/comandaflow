const db = require("../db");
const { auth } = require("../middleware/auth");
const PDFDocument = require('pdfkit');
const { stringify } = require('csv-stringify/sync');

async function routes(fastify) {
  
  // Relatório PDF - Vendas do Período
  fastify.get("/relatorios/vendas/pdf", { onRequest: auth }, async (request, reply) => {
    try {
      const { dataInicio, dataFim } = request.query;
      
      const vendas = db.prepare(`
        SELECT 
          p.id, 
          p.total, 
          p.status,
          p.criado_em,
          c.nome as cliente_nome,
          COUNT(i.id) as total_itens
        FROM pedidos p
        JOIN clientes c ON p.cliente_id = c.id
        LEFT JOIN itens i ON p.id = i.pedido_id
        WHERE DATE(p.criado_em) BETWEEN ? AND ? AND p.status != 'cancelado'
        GROUP BY p.id
        ORDER BY p.criado_em DESC
      `).all(dataInicio || '2020-01-01', dataFim || new Date().toISOString().split('T')[0]);

      const totalVendas = vendas.reduce((sum, v) => sum + v.total, 0);
      const doc = new PDFDocument();

      reply.type('application/pdf');
      doc.pipe(reply.raw);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('🍽️ ComandaFlow', { align: 'center' });
      doc.fontSize(14).text('Relatório de Vendas', { align: 'center' }).moveDown();

      // Período
      doc.fontSize(10).font('Helvetica')
        .text(`Período: ${dataInicio} a ${dataFim}`, { align: 'center' })
        .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' })
        .moveDown();

      // Resumo
      doc.fontSize(12).font('Helvetica-Bold').text('RESUMO', { underline: true }).moveDown(0.5);
      doc.fontSize(11).font('Helvetica')
        .text(`Total de Pedidos: ${vendas.length}`)
        .text(`Total de Vendas: R$ ${totalVendas.toFixed(2)}`)
        .text(`Ticket Médio: R$ ${(totalVendas / vendas.length).toFixed(2)}`)
        .moveDown();

      // Tabela de vendas
      doc.fontSize(12).font('Helvetica-Bold').text('DETALHES DE VENDAS', { underline: true }).moveDown(0.5);

      const tableTop = doc.y;
      const col1 = 50, col2 = 150, col3 = 280, col4 = 380, col5 = 480;

      doc.fontSize(9).font('Helvetica-Bold')
        .text('ID', col1, tableTop)
        .text('Cliente', col2, tableTop)
        .text('Data', col3, tableTop)
        .text('Itens', col4, tableTop)
        .text('Valor', col5, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let y = tableTop + 20;

      vendas.forEach(venda => {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        doc.fontSize(8).font('Helvetica')
          .text(`${venda.id}`, col1, y)
          .text(venda.cliente_nome.substring(0, 20), col2, y)
          .text(new Date(venda.criado_em).toLocaleDateString('pt-BR'), col3, y)
          .text(`${venda.total_itens}`, col4, y)
          .text(`R$ ${venda.total.toFixed(2)}`, col5, y);

        y += 15;
      });

      // Footer
      doc.moveTo(50, doc.page.height - 50).lineTo(550, doc.page.height - 50).stroke();
      doc.fontSize(9).font('Helvetica')
        .text(`Total: R$ ${totalVendas.toFixed(2)}`, 50, doc.page.height - 40, { align: 'right' })
        .text('ComandaFlow © 2026', { align: 'center' });

      doc.end();
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Relatório PDF - Produtos Vendidos
  fastify.get("/relatorios/produtos/pdf", { onRequest: auth }, async (request, reply) => {
    try {
      const { dataInicio, dataFim } = request.query;

      const produtos = db.prepare(`
        SELECT 
          pr.id,
          pr.nome,
          pr.categoria,
          pr.preco,
          SUM(i.quantidade) as total_vendido,
          SUM(i.preco * i.quantidade) as total_vendas,
          COUNT(DISTINCT i.pedido_id) as num_pedidos
        FROM itens i
        JOIN produtos pr ON i.produto_id = pr.id
        JOIN pedidos p ON i.pedido_id = p.id
        WHERE DATE(p.criado_em) BETWEEN ? AND ? AND p.status != 'cancelado'
        GROUP BY pr.id
        ORDER BY total_vendas DESC
      `).all(dataInicio || '2020-01-01', dataFim || new Date().toISOString().split('T')[0]);

      const doc = new PDFDocument();
      reply.type('application/pdf');
      doc.pipe(reply.raw);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('🍽️ ComandaFlow', { align: 'center' });
      doc.fontSize(14).text('Relatório de Produtos', { align: 'center' }).moveDown();
      
      doc.fontSize(10).font('Helvetica')
        .text(`Período: ${dataInicio} a ${dataFim}`, { align: 'center' })
        .moveDown();

      // Tabela
      doc.fontSize(12).font('Helvetica-Bold').text('VENDAS POR PRODUTO', { underline: true }).moveDown(0.5);

      const tableTop = doc.y;
      const col1 = 50, col2 = 150, col3 = 280, col4 = 380, col5 = 480;

      doc.fontSize(9).font('Helvetica-Bold')
        .text('Produto', col1, tableTop)
        .text('Categ.', col2, tableTop)
        .text('Qtd', col3, tableTop)
        .text('Pedidos', col4, tableTop)
        .text('Receita', col5, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let y = tableTop + 20;

      produtos.forEach(prod => {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        doc.fontSize(8).font('Helvetica')
          .text(prod.nome.substring(0, 25), col1, y)
          .text(prod.categoria, col2, y)
          .text(`${prod.total_vendido}x`, col3, y)
          .text(`${prod.num_pedidos}`, col4, y)
          .text(`R$ ${prod.total_vendas.toFixed(2)}`, col5, y);

        y += 15;
      });

      const totalReceita = produtos.reduce((sum, p) => sum + p.total_vendas, 0);

      doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();
      doc.fontSize(10).font('Helvetica-Bold')
        .text(`TOTAL: R$ ${totalReceita.toFixed(2)}`, 50, y + 20);

      doc.end();
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Relatório PDF - Clientes
  fastify.get("/relatorios/clientes/pdf", { onRequest: auth }, async (request, reply) => {
    try {
      const clientes = db.prepare(`
        SELECT 
          c.id,
          c.nome,
          c.pulseira,
          c.telefone,
          c.status,
          COUNT(p.id) as total_pedidos,
          SUM(p.total) as total_gasto,
          MAX(p.criado_em) as ultimo_pedido
        FROM clientes c
        LEFT JOIN pedidos p ON c.id = p.cliente_id AND p.status != 'cancelado'
        GROUP BY c.id
        ORDER BY total_gasto DESC
      `).all();

      const doc = new PDFDocument();
      reply.type('application/pdf');
      doc.pipe(reply.raw);

      // Header
      doc.fontSize(20).font('Helvetica-Bold').text('🍽️ ComandaFlow', { align: 'center' });
      doc.fontSize(14).text('Relatório de Clientes', { align: 'center' }).moveDown();
      doc.fontSize(10).font('Helvetica').text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' }).moveDown();

      // Tabela
      doc.fontSize(12).font('Helvetica-Bold').text('CLIENTES REGISTRADOS', { underline: true }).moveDown(0.5);

      const tableTop = doc.y;
      const col1 = 50, col2 = 130, col3 = 230, col4 = 320, col5 = 420;

      doc.fontSize(9).font('Helvetica-Bold')
        .text('Nome', col1, tableTop)
        .text('Pulseira', col2, tableTop)
        .text('Pedidos', col3, tableTop)
        .text('Total Gasto', col4, tableTop)
        .text('Último Ped.', col5, tableTop);

      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      let y = tableTop + 20;

      clientes.forEach(cliente => {
        if (y > 750) {
          doc.addPage();
          y = 50;
        }

        doc.fontSize(8).font('Helvetica')
          .text(cliente.nome.substring(0, 20), col1, y)
          .text(cliente.pulseira || '-', col2, y)
          .text(`${cliente.total_pedidos}`, col3, y)
          .text(`R$ ${(cliente.total_gasto || 0).toFixed(2)}`, col4, y)
          .text(cliente.ultimo_pedido ? new Date(cliente.ultimo_pedido).toLocaleDateString('pt-BR') : '-', col5, y);

        y += 15;
      });

      doc.end();
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Export CSV - Vendas
  fastify.get("/relatorios/vendas/csv", { onRequest: auth }, async (request, reply) => {
    try {
      const { dataInicio, dataFim } = request.query;

      const vendas = db.prepare(`
        SELECT 
          p.id as 'Pedido ID',
          c.nome as 'Cliente',
          c.pulseira as 'Pulseira',
          p.total as 'Total (R$)',
          p.status as 'Status',
          p.criado_em as 'Data/Hora'
        FROM pedidos p
        JOIN clientes c ON p.cliente_id = c.id
        WHERE DATE(p.criado_em) BETWEEN ? AND ? AND p.status != 'cancelado'
        ORDER BY p.criado_em DESC
      `).all(dataInicio || '2020-01-01', dataFim || new Date().toISOString().split('T')[0]);

      const csv = stringify(vendas, { header: true });

      reply.type('text/csv');
      reply.header('Content-Disposition', `attachment; filename="vendas_${Date.now()}.csv"`);
      reply.send(csv);
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Export CSV - Produtos
  fastify.get("/relatorios/produtos/csv", { onRequest: auth }, async (request, reply) => {
    try {
      const { dataInicio, dataFim } = request.query;

      const produtos = db.prepare(`
        SELECT 
          pr.nome as 'Produto',
          pr.categoria as 'Categoria',
          pr.preco as 'Preço Unitário (R$)',
          SUM(i.quantidade) as 'Quantidade Vendida',
          COUNT(DISTINCT i.pedido_id) as 'Num. Pedidos',
          SUM(i.preco * i.quantidade) as 'Total (R$)'
        FROM itens i
        JOIN produtos pr ON i.produto_id = pr.id
        JOIN pedidos p ON i.pedido_id = p.id
        WHERE DATE(p.criado_em) BETWEEN ? AND ? AND p.status != 'cancelado'
        GROUP BY pr.id
        ORDER BY CAST(SUM(i.preco * i.quantidade) AS INTEGER) DESC
      `).all(dataInicio || '2020-01-01', dataFim || new Date().toISOString().split('T')[0]);

      const csv = stringify(produtos, { header: true });

      reply.type('text/csv');
      reply.header('Content-Disposition', `attachment; filename="produtos_${Date.now()}.csv"`);
      reply.send(csv);
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });

  // Export CSV - Clientes
  fastify.get("/relatorios/clientes/csv", { onRequest: auth }, async (request, reply) => {
    try {
      const clientes = db.prepare(`
        SELECT 
          c.nome as 'Nome',
          c.pulseira as 'Pulseira',
          c.cpf as 'CPF',
          c.telefone as 'Telefone',
          c.status as 'Status',
          COUNT(p.id) as 'Total Pedidos',
          SUM(p.total) as 'Total Gasto (R$)',
          MAX(p.criado_em) as 'Último Pedido'
        FROM clientes c
        LEFT JOIN pedidos p ON c.id = p.cliente_id AND p.status != 'cancelado'
        GROUP BY c.id
        ORDER BY CAST(SUM(p.total) AS INTEGER) DESC
      `).all();

      const csv = stringify(clientes, { header: true });

      reply.type('text/csv');
      reply.header('Content-Disposition', `attachment; filename="clientes_${Date.now()}.csv"`);
      reply.send(csv);
    } catch (err) {
      return reply.code(500).send({ erro: err.message });
    }
  });
}

module.exports = routes;
