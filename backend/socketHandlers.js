/**
 * Centralizador de handlers do Socket.IO
 *
 * Remove duplicação de código
 * Padroniza emissão de eventos
 * Facilita manutenção e testes
 */

const { AppError, errors } = require('./errors');

/**
 * Atualizar status do pedido
 * @param {Object} db - Instância do database
 * @param {Object} io - Instância do Socket.IO
 * @param {number} orderId - ID do pedido
 * @param {string} newStatus - Novo status (preparando, pronto, entregue)
 * @throws {AppError} Se pedido não existe ou falha na atualização
 */
const updateOrderStatus = (db, io, orderId, newStatus) => {
  try {
    // Validar pedido existe
    const order = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(orderId);
    if (!order) {
      throw errors.notFound('Pedido');
    }

    // Atualizar no banco
    db.prepare('UPDATE pedidos SET status = ? WHERE id = ?')
      .run(newStatus, orderId);

    console.log(`✅ Pedido #${orderId} → ${newStatus.toUpperCase()}`);

    // Emitir evento para todos os clientes
    io.emit('pedido_status', {
      pedido_id: orderId,
      status: newStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error(`❌ Erro ao atualizar pedido #${orderId}:`, err.message);
    throw err;
  }
};

/**
 * Registrar handlers de status do pedido
 * @param {Object} socket - Socket.IO socket instance
 * @param {Object} db - Database instance
 * @param {Object} io - Socket.IO server instance
 */
const registerOrderStatusHandlers = (socket, db, io) => {
  // Mapeamento de eventos Socket.IO para status e emojis
  const statusMap = {
    'pedido_preparando': { status: 'preparando', emoji: '👨‍🍳' },
    'pedido_pronto': { status: 'pronto', emoji: '✅' },
    'pedido_entregue': { status: 'entregue', emoji: '🚚' },
  };

  // Registrar handler para cada status dinamicamente
  Object.entries(statusMap).forEach(([event, { status, emoji }]) => {
    socket.on(event, (data) => {
      try {
        console.log(`${emoji} ${event.toUpperCase()}`);
        updateOrderStatus(db, io, data.pedido_id, status);
      } catch (err) {
        console.error(`Erro no handler ${event}:`, err.message);
        socket.emit('erro', {
          message: err.message,
          code: err.code || 'UNKNOWN_ERROR',
        });
      }
    });
  });
};

/**
 * Registrar handlers de novo pedido
 * @param {Object} socket - Socket.IO socket instance
 * @param {Object} db - Database instance
 * @param {Object} io - Socket.IO server instance
 */
const registerNewOrderHandler = (socket, db, io) => {
  socket.on('novo_pedido', (data) => {
    try {
      console.log('📦 Novo pedido recebido:', data);

      // Buscar pedido com detalhes
      const pedido = db.prepare('SELECT * FROM pedidos WHERE id = ?').get(data.pedido_id);
      if (!pedido) {
        throw errors.notFound('Pedido');
      }

      // Buscar itens do pedido
      const itens = db.prepare(`
        SELECT i.*, pr.nome as produto_nome
        FROM itens i
        JOIN produtos pr ON i.produto_id = pr.id
        WHERE i.pedido_id = ?
      `).all(data.pedido_id);

      // Buscar cliente
      const cliente = db.prepare('SELECT * FROM clientes WHERE id = ?').get(pedido.cliente_id);
      if (!cliente) {
        throw errors.notFound('Cliente');
      }

      // Emitir para cozinha com dados completos
      io.emit('pedido_cozinha', {
        ...pedido,
        cliente: cliente.nome,
        pulseira: cliente.pulseira,
        itens,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.error('❌ Erro ao processar novo pedido:', err.message);
      socket.emit('erro', {
        message: err.message,
        code: err.code || 'UNKNOWN_ERROR',
      });
    }
  });
};

/**
 * Registrar todos os handlers de Socket.IO
 * @param {Object} socket - Socket.IO socket instance
 * @param {Object} db - Database instance
 * @param {Object} io - Socket.IO server instance
 */
const registerSocketHandlers = (socket, db, io) => {
  console.log('🟢 Cliente conectado:', socket.id);

  // Novo pedido
  registerNewOrderHandler(socket, db, io);

  // Atualizações de status
  registerOrderStatusHandlers(socket, db, io);

  // Desconexão
  socket.on('disconnect', () => {
    console.log('🔴 Cliente desconectado:', socket.id);
  });
};

module.exports = {
  updateOrderStatus,
  registerSocketHandlers,
};
