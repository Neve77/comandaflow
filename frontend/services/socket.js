import io from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';

let socket = null;

// Conectar ao socket
export const conectarSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      console.log('✅ Conectado ao servidor');
    });

    socket.on('disconnect', () => {
      console.log('❌ Desconectado do servidor');
    });

    socket.on('connect_error', (error) => {
      console.error('Erro de conexão:', error);
    });
  }
  return socket;
};

// Desconectar do socket
export const desconectarSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Obter socket
export const obterSocket = () => {
  if (!socket) {
    return conectarSocket();
  }
  return socket;
};

// Listeners e Emitters para Garçom
export const garcom = {
  // Enviar novo pedido
  enviarPedido: (pedido_id) => {
    const socket = obterSocket();
    socket.emit('novo_pedido', { pedido_id });
  },

  // Ouvir atualizações de status
  ouvirStatusPedido: (callback) => {
    const socket = obterSocket();
    socket.on('pedido_status', callback);
  },

  removerStatusPedido: () => {
    const socket = obterSocket();
    socket.off('pedido_status');
  },
};

// Listeners e Emitters para Cozinha
export const cozinha = {
  // Ouvir novos pedidos
  ouvirPedidos: (callback) => {
    const socket = obterSocket();
    socket.on('pedido_cozinha', callback);
  },

  removerPedidos: () => {
    const socket = obterSocket();
    socket.off('pedido_cozinha');
  },

  // Notificar que está preparando
  preparando: (pedido_id) => {
    const socket = obterSocket();
    socket.emit('pedido_preparando', { pedido_id });
  },

  // Notificar que está pronto
  pronto: (pedido_id) => {
    const socket = obterSocket();
    socket.emit('pedido_pronto', { pedido_id });
  },

  // Notificar que foi entregue
  entregue: (pedido_id) => {
    const socket = obterSocket();
    socket.emit('pedido_entregue', { pedido_id });
  },

  // Ouvir atualizações
  ouvirAtualizacoes: (callback) => {
    const socket = obterSocket();
    socket.on('pedido_status', callback);
  },

  removerAtualizacoes: () => {
    const socket = obterSocket();
    socket.off('pedido_status');
  },
};
