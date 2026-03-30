// Configurar porta do backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
let token = null;

// Definir token (após login)
export const setToken = (newToken) => {
  token = newToken;
  localStorage.setItem('token', newToken);
};

// Obter token do localStorage
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return token;
};

// Limpar token (logout)
export const clearToken = () => {
  token = null;
  localStorage.removeItem('token');
};

// Requisição genérica
const request = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const tokenAtual = getToken();
  if (tokenAtual) {
    headers.Authorization = `Bearer ${tokenAtual}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.erro || `Erro: ${response.status}`);
  }

  return data;
};

// AUTH
export const auth = {
  registro: (nome, email, senha) =>
    request('/auth/registro', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
    }),

  login: (email, senha) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
    }),
};

// CLIENTES
export const clientes = {
  listar: () => request('/clientes'),

  porPulseira: (pulseira) => request(`/clientes/pulseira/${pulseira}`),

  criar: (nome, cpf, telefone, pulseira) =>
    request('/clientes', {
      method: 'POST',
      body: JSON.stringify({ nome, cpf, telefone, pulseira }),
    }),

  pedidos: (cliente_id) => request(`/clientes/${cliente_id}/pedidos`),
};

// PRODUTOS
export const produtos = {
  listar: () => request('/produtos'),

  porCategoria: (categoria) => request(`/produtos/categoria/${categoria}`),

  criar: (nome, preco, categoria) =>
    request('/produtos', {
      method: 'POST',
      body: JSON.stringify({ nome, preco, categoria }),
    }),

  atualizar: (id, nome, preco, categoria, ativo) =>
    request(`/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nome, preco, categoria, ativo }),
    }),
};

// PEDIDOS
export const pedidos = {
  criar: (pulseira, itens) =>
    request('/pedido', {
      method: 'POST',
      body: JSON.stringify({ pulseira, itens }),
    }),

  listar: (limit = 50, offset = 0) =>
    request(`/pedidos?limit=${limit}&offset=${offset}`),

  pendentes: () => request('/pedidos/pendentes'),

  obter: (id) => request(`/pedidos/${id}`),

  atualizarStatus: (id, status) =>
    request(`/pedidos/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// FECHAMENTO
export const fechamento = {
  listar: () => request('/fechamento'),

  porPulseira: (pulseira) => request(`/fechamento/${pulseira}`),

  finalizar: (pulseira, pagamento_tipo = 'dinheiro') =>
    request('/fechar', {
      method: 'POST',
      body: JSON.stringify({ pulseira, pagamento_tipo }),
    }),
};

// DASHBOARD
export const dashboard = {
  overview: () => request('/dashboard'),

  historico: (dias = 7) => request(`/dashboard/historico?dias=${dias}`),

  cozinha: () => request('/dashboard/cozinha'),
};
