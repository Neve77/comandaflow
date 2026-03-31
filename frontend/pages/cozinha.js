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
    return p?.status === filtro;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-300">Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-0 right-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-red-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '1s'}} />

      {/* Header */}
      <div className="backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">👨‍🍳 Cozinha</h1>
            <p className="text-sm text-slate-400">Fila de pedidos em tempo real</p>
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
        <div className="fixed top-20 right-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm z-50">
          {erro}
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Filtros */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['todos', 'pendente', 'preparando', 'pronto', 'entregue'].map((status) => (
            <button
              key={status}
              onClick={() => setFiltro(status)}
              className={`px-4 py-2 rounded-lg font-medium transition whitespace-nowrap border ${
                filtro === status
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-500/50'
                  : 'bg-slate-800/40 text-slate-300 border-slate-600/50 hover:border-slate-500/50'
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
              <p className="text-5xl mb-2">🎉</p>
              <p className="text-slate-400">Nenhum pedido neste status</p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => {
              const badge = getStatusBadge(pedido.status);
              return (
                <div
                  key={pedido.id}
                  className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-orange-600/50 hover:border-orange-500/80 shadow-lg hover:shadow-orange-600/20 transition p-6"
                >
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-100">#{pedido.id}</h2>
                      {pedido?.cliente && (
                        <p className="text-sm text-slate-400">{pedido.cliente}</p>
                      )}
                    </div>
                    <span
                      className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full font-medium text-sm`}
                    >
                      {badge.icon} {pedido?.status ? pedido.status.toUpperCase() : 'PENDENTE'}
                    </span>
                  </div>

                  {/* Itens */}
                  <div className="bg-slate-700/40 rounded-lg p-4 mb-4 max-h-48 overflow-y-auto border border-slate-600/50">
                    <h3 className="font-bold text-slate-100 mb-3 text-sm">Itens do pedido:</h3>
                    <div className="space-y-2">
                      {pedido.itens && pedido.itens.length > 0 ? (
                        pedido.itens.map((item) => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="text-slate-300">{item.produto_nome}</span>
                            <span className="bg-orange-600/40 text-orange-300 px-2 py-1 rounded font-medium border border-orange-600/50">
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
                    {pedido?.status === 'pendente' && (
                      <button
                        onClick={() => mudarStatus(pedido.id, 'preparando')}
                        className="flex-1 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-medium py-2 rounded-lg transition shadow-lg hover:shadow-orange-600/50"
                      >
                        👨‍🍳 Preparando
                      </button>
                    )}

                    {pedido?.status === 'preparando' && (
                      <button
                        onClick={() => mudarStatus(pedido.id, 'pronto')}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-2 rounded-lg transition shadow-lg hover:shadow-emerald-600/50"
                      >
                        ✅ Pronto
                      </button>
                    )}

                    {pedido?.status === 'pronto' && (
                      <button
                        onClick={() => mudarStatus(pedido.id, 'entregue')}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-2 rounded-lg transition shadow-lg hover:shadow-blue-600/50"
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
