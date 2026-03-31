import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../services/api';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');
  const [aba, setAba] = useState('listar'); // 'listar' ou 'criar'

  // Formulário para novo pedido
  const [novoPedido, setNovoPedido] = useState({
    clienteId: '',
    total: '',
  });

  // Busca por comanda
  const [pulseiraFiltro, setPulseiraFiltro] = useState('');

  // Edição de preço
  const [editandoId, setEditandoId] = useState(null);
  const [novoTotal, setNovoTotal] = useState('');

  // Anotação de pedido
  const [anotandoId, setAnotandoId] = useState(null);
  const [novaNota, setNovaNota] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [pedidosData, clientesData] = await Promise.all([
        api.pedidos.listar(),
        api.clientes.listar(),
      ]);

      setPedidos(pedidosData.pedidos || []);
      setClientes(clientesData.clientes || []);
      setErro('');
    } catch (err) {
      setErro('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const formatarMoeda = (valor) => {
    if (!valor || typeof valor !== 'number') return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return '';
    const data = new Date(dataStr);
    return data.toLocaleString('pt-BR');
  };

  // Criar novo pedido
  const handleCriarPedido = async (e) => {
    e.preventDefault();

    if (!novoPedido.clienteId || !novoPedido.total) {
      setErro('Selecione um cliente e informe o valor');
      return;
    }

    try {
      const cliente = clientes.find(c => c.id === parseInt(novoPedido.clienteId));
      const response = await api.pedidos.criar(cliente.pulseira, []);

      // Atualizar o total do pedido criado
      await api.pedidos.atualizar(response.id, parseFloat(novoPedido.total));
      
      setSuccess('Pedido criado com sucesso!');
      setNovoPedido({ clienteId: '', total: '' });
      setTimeout(() => setSuccess(''), 3000);
      carregarDados();
    } catch (err) {
      setErro('Erro ao criar pedido');
    }
  };

  // Deletar pedido
  const handleDeletarPedido = async (pedidoId) => {
    if (!window.confirm('Tem certeza que deseja deletar este pedido?')) {
      return;
    }

    try {
      await api.pedidos.deletar(pedidoId);
      setSuccess('Pedido deletado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      carregarDados();
    } catch (err) {
      setErro('Erro ao deletar pedido');
    }
  };

  // Atualizar total do pedido
  const handleAtualizarTotal = async (pedidoId) => {
    if (!novoTotal || isNaN(parseFloat(novoTotal))) {
      setErro('Informe um valor válido');
      return;
    }

    try {
      await api.pedidos.atualizar(pedidoId, parseFloat(novoTotal));
      setSuccess('Preço atualizado com sucesso!');
      setEditandoId(null);
      setNovoTotal('');
      setTimeout(() => setSuccess(''), 3000);
      carregarDados();
    } catch (err) {
      setErro('Erro ao atualizar preço');
    }
  };

  // Adicionar anotação
  const handleAdicionarNota = async (pedidoId) => {
    if (!novaNota.trim()) {
      setErro('Digite uma anotação');
      return;
    }

    try {
      await api.pedidos.adicionarNota(pedidoId, novaNota);
      setSuccess('Anotação adicionada com sucesso!');
      setAnotandoId(null);
      setNovaNota('');
      setTimeout(() => setSuccess(''), 3000);
      carregarDados();
    } catch (err) {
      setErro('Erro ao adicionar anotação');
    }
  };

  // Filtrar pedidos por comanda
  const pedidosFiltrados = pedidos.filter(p => {
    const cliente = clientes.find(c => c.id === p.cliente_id);
    return !pulseiraFiltro || (cliente && cliente.pulseira.includes(pulseiraFiltro));
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-300">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '1s'}} />

      {/* Header */}
      <div className="backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">📋 Gerenciador de Pedidos</h1>
            <p className="text-sm text-slate-400">Anotações de comanda e gerenciamento de pedidos</p>
          </div>
          <Link href="/">
            <button className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-100 px-4 py-2 rounded-lg text-sm font-medium transition border border-slate-600/50">
              ← Menu
            </button>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {erro && (
        <div className="fixed top-20 right-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-lg max-w-md backdrop-blur-sm z-50">
          {erro}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-lg shadow-lg max-w-md backdrop-blur-sm z-50">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6 relative z-10">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setAba('listar')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              aba === 'listar'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            📋 Listar Pedidos
          </button>
          <button
            onClick={() => setAba('criar')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              aba === 'criar'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            ➕ Criar Pedido
          </button>
        </div>

        {/* Tab: Listar Pedidos */}
        {aba === 'listar' && (
          <div className="space-y-6">
            {/* Filtro por comanda */}
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <label className="block text-sm font-medium text-slate-300 mb-3">
                🔍 Filtrar por Comanda (Pulseira)
              </label>
              <input
                type="text"
                value={pulseiraFiltro}
                onChange={(e) => setPulseiraFiltro(e.target.value)}
                placeholder="Digite o número da pulseira..."
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
              />
            </div>

            {/* Lista de pedidos */}
            <div className="grid gap-4">
              {pedidosFiltrados.length === 0 ? (
                <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8 text-center">
                  <p className="text-slate-400">Nenhum pedido encontrado</p>
                </div>
              ) : (
                pedidosFiltrados.map(pedido => {
                  const cliente = clientes.find(c => c.id === pedido.cliente_id);
                  return (
                    <div key={pedido.id} className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-400 uppercase">Comanda</p>
                          <p className="text-lg font-bold text-purple-400">{cliente?.pulseira || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase">Cliente</p>
                          <p className="text-lg font-bold text-slate-100">{cliente?.nome || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 uppercase">Total</p>
                          <p className="text-lg font-bold text-emerald-400">{formatarMoeda(pedido.total)}</p>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="mb-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          pedido.status === 'concluído'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {pedido.status?.toUpperCase() || 'PENDENTE'}
                        </span>
                      </div>

                      {/* Anotações */}
                      {pedido.anotacoes && (
                        <div className="mb-4 bg-slate-700/30 rounded-lg p-3 text-sm">
                          <p className="text-slate-300 font-medium mb-2">📝 Anotações:</p>
                          <div className="text-slate-400 whitespace-pre-wrap text-xs font-mono">
                            {pedido.anotacoes}
                          </div>
                        </div>
                      )}

                      {/* Data */}
                      <p className="text-xs text-slate-500 mb-4">{formatarData(pedido.criado_em)}</p>

                      {/* Ações */}
                      <div className="space-y-3">
                        {/* Adicionar nota */}
                        {anotandoId === pedido.id ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={novaNota}
                              onChange={(e) => setNovaNota(e.target.value)}
                              placeholder="Digite sua anotação..."
                              className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 text-sm"
                            />
                            <button
                              onClick={() => handleAdicionarNota(pedido.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => {
                                setAnotandoId(null);
                                setNovaNota('');
                              }}
                              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-100 rounded-lg text-sm font-medium transition"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAnotandoId(pedido.id)}
                            className="w-full px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 rounded-lg text-sm font-medium transition border border-blue-600/30"
                          >
                            📝 Adicionar Anotação
                          </button>
                        )}

                        {/* Editar preço */}
                        {editandoId === pedido.id ? (
                          <div className="flex gap-2">
                            <input
                              type="number"
                              step="0.01"
                              value={novoTotal}
                              onChange={(e) => setNovoTotal(e.target.value)}
                              placeholder="Novo total..."
                              className="flex-1 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 text-sm"
                            />
                            <button
                              onClick={() => handleAtualizarTotal(pedido.id)}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => {
                                setEditandoId(null);
                                setNovoTotal('');
                              }}
                              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-100 rounded-lg text-sm font-medium transition"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setEditandoId(pedido.id);
                              setNovoTotal(pedido.total.toString());
                            }}
                            className="w-full px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 rounded-lg text-sm font-medium transition border border-purple-600/30"
                          >
                            💰 Editar Preço
                          </button>
                        )}

                        {/* Deletar */}
                        <button
                          onClick={() => handleDeletarPedido(pedido.id)}
                          className="w-full px-4 py-2 bg-red-600/30 hover:bg-red-600/50 text-red-200 rounded-lg text-sm font-medium transition border border-red-600/30"
                        >
                          🗑️ Deletar Pedido
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab: Criar Pedido */}
        {aba === 'criar' && (
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 max-w-md">
            <h2 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">➕ Novo Pedido</h2>

            <form onSubmit={handleCriarPedido} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">👤 Cliente</label>
                <select
                  value={novoPedido.clienteId}
                  onChange={(e) => setNovoPedido(prev => ({ ...prev, clienteId: e.target.value }))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                >
                  <option value="">Selecione um cliente...</option>
                  {clientes.map(cliente => (
                    <option key={cliente.id} value={cliente.id}>
                      {cliente.nome} (Pulseira: {cliente.pulseira})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">💰 Valor Total (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={novoPedido.total}
                  onChange={(e) => setNovoPedido(prev => ({ ...prev, total: e.target.value }))}
                  placeholder="0,00"
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50"
                />
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition"
              >
                ✓ Criar Pedido
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
