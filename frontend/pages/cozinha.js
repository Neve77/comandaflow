import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../services/api';
import { cozinha, conectarSocket } from '../services/socket';

export default function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    carregarPedidos();
    conectarSocket();

    // Ouvir novos pedidos
    cozinha.ouvirPedidos((pedidoNovo) => {
      setPedidos((prev) => {
        if (prev.find((p) => p.id === pedidoNovo.id)) return prev;
        return [pedidoNovo, ...prev];
      });
    });

    // Ouvir atualizações
    cozinha.ouvirAtualizacoes((atualizacao) => {
      setPedidos((prev) =>
        prev.map((p) =>
          p.id === atualizacao.pedido_id ? { ...p, status: atualizacao.status } : p
        )
      );
    });

    return () => {
      cozinha.removerPedidos();
      cozinha.removerAtualizacoes();
    };
  }, []);

  const carregarPedidos = async () => {
    try {
      const data = await api.pedidos.pendentes();
      setPedidos(data.pedidos || []);
    } catch (err) {
      setErro('Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const mudarStatus = async (pedido_id, novoStatus) => {
    try {
      await api.pedidos.atualizarStatus(pedido_id, novoStatus);

      if (novoStatus === 'preparando') {
        cozinha.preparando(pedido_id);
      } else if (novoStatus === 'pronto') {
        cozinha.pronto(pedido_id);
      } else if (novoStatus === 'entregue') {
        cozinha.entregue(pedido_id);
      }

      setPedidos((prev) =>
        prev.map((p) => (p.id === pedido_id ? { ...p, status: novoStatus } : p))
      );
    } catch (err) {
      setErro(err.message);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pendente: { bg: 'bg-red-100', text: 'text-red-700', icon: '⏳' },
      preparando: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '👨‍🍳' },
      pronto: { bg: 'bg-green-100', text: 'text-green-700', icon: '✅' },
      entregue: { bg: 'bg-blue-100', text: 'text-blue-700', icon: '🚚' },
    };
    return badges[status] || badges.pendente;
  };

  const pedidosFiltrados = pedidos.filter((p) => {
    if (filtro === 'todos') return true;
    return p.status === filtro;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">👨‍🍳 Cozinha</h1>
            <p className="text-sm text-slate-500">Fila de pedidos em tempo real</p>
          </div>
          <Link href="/">
            <button className="bg-slate-200 hover:bg-slate-300 text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition">
              ← Menu
            </button>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {erro && (
        <div className="fixed top-20 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg">
          {erro}
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex gap-2 mb-6">
          {['todos', 'pendente', 'preparando', 'pronto', 'entregue'].map((status) => (
            <button
              key={status}
              onClick={() => setFiltro(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filtro === status
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Pedidos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidosFiltrados.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-3xl mb-2">🎉</p>
              <p className="text-slate-600">Nenhum pedido neste status</p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => {
              const badge = getStatusBadge(pedido.status);
              return (
                <div
                  key={pedido.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 border-l-4 border-purple-600"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">#{pedido.id}</h2>
                      {pedido.cliente && (
                        <p className="text-sm text-slate-600">{pedido.cliente}</p>
                      )}
                    </div>
                    <span
                      className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full font-medium text-sm`}
                    >
                      {badge.icon} {pedido.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Itens */}
                  <div className="bg-slate-50 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto">
                    <h3 className="font-bold text-slate-900 mb-3 text-sm">Itens do pedido:</h3>
                    <div className="space-y-2">
                      {pedido.itens && pedido.itens.length > 0 ? (
                        pedido.itens.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-700">{item.produto_nome}</span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium">
                              x{item.quantidade}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-500 text-xs">Sem itens</p>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex gap-2">
                    {pedido.status === 'pendente' && (
                      <button
                        onClick={() => mudarStatus(pedido.id, 'preparando')}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 rounded-lg transition"
                      >
                        👨‍🍳 Preparando
                      </button>
                    )}

                    {pedido.status === 'preparando' && (
                      <button
                        onClick={() => mudarStatus(pedido.id, 'pronto')}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded-lg transition"
                      >
                        ✅ Pronto
                      </button>
                    )}

                    {pedido.status === 'pronto' && (
                      <button
                        onClick={() => mudarStatus(pedido.id, 'entregue')}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded-lg transition"
                      >
                        🚚 Entregue
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
