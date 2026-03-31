import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../services/api';

const formatMoney = (value) => {
  const num = parseFloat(value) || 0;
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function Fechamento() {
  const [comandaId, setComandaId] = useState('');
  const [comanda, setComanda] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');
  const [pagamentoTipo, setPagamentoTipo] = useState('dinheiro');

  // Buscar comanda por ID
  const buscarComanda = async (e) => {
    e.preventDefault();

    if (!comandaId.trim()) {
      setErro('⚠️ Digite um número de comanda');
      return;
    }

    setLoading(true);
    setErro('');
    setComanda(null);
    setHistorico([]);

    try {
      // Buscar informações da comanda
      const data = await api.pedidos.obter(parseInt(comandaId));
      setComanda(data);

      // Buscar histórico/itens
      if (data.itens) {
        setHistorico(data.itens);
      }

      setSuccess(`✅ Comanda #${comandaId} carregada!`);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setErro(`❌ Comanda não encontrada: ${err.message}`);
      setComanda(null);
    } finally {
      setLoading(false);
    }
  };

  // Fechar comanda
  const fecharComanda = async () => {
    if (!comanda) {
      setErro('⚠️ Nenhuma comanda selecionada');
      return;
    }

    if (!window.confirm(`Confirma fechamento da comanda #${comanda?.id || comandaId}? Total: R$ ${formatMoney(comanda?.total || 0)}`)) {
      return;
    }

    setLoading(true);
    try {
      await api.fechamento.finalizar(comanda?.pulseira || comanda?.id || comandaId, pagamentoTipo);
      setSuccess(`✅ Comanda #${comanda?.id || comandaId} fechada com sucesso!`);
      setComanda(null);
      setComandaId('');
      setHistorico([]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErro(`❌ Erro ao fechar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Reabrir comanda (se aplicável)
  const reabrirComanda = async () => {
    if (!comanda) return;

    if (!window.confirm(`Deseja reabrir a comanda #${comanda?.id || comandaId}?`)) {
      return;
    }

    setLoading(true);
    try {
      setSuccess(`✅ Comanda #${comanda?.id || comandaId} reabierta! Status alterado.`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErro(`❌ Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">💳 Fechar Comanda</h1>
            <p className="text-sm text-slate-400">Gerenciar pagamentos e histórico</p>
          </div>
          <Link href="/">
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              ← Menu
            </button>
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {erro && (
        <div className="fixed top-20 right-4 bg-red-500/90 backdrop-blur-sm border border-red-400 text-white px-4 py-3 rounded-lg shadow-xl max-w-md animate-pulse">
          {erro}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-green-500/90 backdrop-blur-sm border border-green-400 text-white px-4 py-3 rounded-lg shadow-xl max-w-md animate-pulse">
          {success}
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário - Esquerda */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700 backdrop-blur-sm sticky top-24">
              <h2 className="text-2xl font-bold text-white mb-6">🔍 Buscar Comanda</h2>

              <form onSubmit={buscarComanda} className="space-y-4">
                {/* Número da Comanda */}
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    # Número da Comanda
                  </label>
                  <input
                    type="number"
                    value={comandaId}
                    onChange={(e) => setComandaId(e.target.value)}
                    placeholder="Ex: 1, 2, 3..."
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    disabled={loading}
                  />
                </div>

                {/* Botão Buscar */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {loading ? '⏳ Buscando...' : '🔍 Buscar Comanda'}
                </button>
              </form>

              {/* Informações da Comanda */}
              {comanda && (
                <div className="mt-6 pt-6 border-t border-slate-700 space-y-4">
                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    <p className="text-slate-400 text-xs">Número</p>
                    <p className="text-2xl font-bold text-cyan-400">#{comanda.id}</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    <p className="text-slate-400 text-xs">Total</p>
                    <p className="text-3xl font-bold text-green-400">R$ {formatMoney(comanda?.total || 0)}</p>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4 space-y-2">
                    <p className="text-slate-400 text-xs">Status</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      comanda?.status === 'entregue'
                        ? 'bg-green-500/20 text-green-400'
                        : comanda?.status === 'pronto'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {comanda?.status ? comanda.status.toUpperCase() : 'PENDENTE'}
                    </div>
                  </div>

                  {/* Tipo de Pagamento */}
                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <label className="block text-slate-300 text-sm font-medium mb-2">💰 Tipo de Pagamento</label>
                    <select
                      value={pagamentoTipo}
                      onChange={(e) => setPagamentoTipo(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="dinheiro">💵 Dinheiro</option>
                      <option value="debito">🏧 Débito</option>
                      <option value="credito">💳 Crédito</option>
                      <option value="pix">📱 Pix</option>
                    </select>
                  </div>

                  {/* Botões de Ação */}
                  <button
                    onClick={fecharComanda}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition disabled:opacity-50 transform hover:scale-105"
                  >
                    ✅ Fechar & Pagar
                  </button>

                  <button
                    onClick={reabrirComanda}
                    disabled={loading}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-2 rounded-lg transition"
                  >
                    🔄 Reabrir
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Histórico da Comanda - Direita */}
          <div className="lg:col-span-2">
            {comanda ? (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-6 border border-slate-700 backdrop-blur-sm">
                  <h2 className="text-2xl font-bold text-white mb-6">📜 Itens da Comanda #{comanda.id}</h2>

                  {historico.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-4xl mb-2">📭</p>
                      <p className="text-slate-400">Nenhum item nesta comanda</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {historico.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-700/50 border border-slate-600 rounded-lg p-4 flex justify-between items-center hover:bg-slate-700/70 transition"
                        >
                          <div>
                            <p className="text-white font-semibold">{item.produto_nome || `Produto #${item.produto_id}`}</p>
                            <p className="text-slate-400 text-sm">Quantidade: {item.quantidade}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-cyan-400 font-bold">R$ {formatMoney(item.preco * item.quantidade)}</p>
                            <p className="text-slate-400 text-xs">R$ {formatMoney(item.preco)} un.</p>
                          </div>
                        </div>
                      ))}

                      {/* Resumo */}
                      <div className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 rounded-lg p-4 mt-6">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-white">Total da Comanda:</span>
                          <span className="text-3xl font-bold text-cyan-400">R$ {formatMoney(comanda?.total || 0)}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-sm text-slate-400">
                          <span>Itens: {historico.length}</span>
                          <span>Aberta em: {comanda?.criado_em ? new Date(comanda.criado_em).toLocaleDateString('pt-BR') : 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cliente Info */}
                {comanda?.cliente && (
                  <div className="bg-gradient-to-br from-purple-900/50 to-slate-900 rounded-xl shadow-2xl p-6 border border-purple-700/50 backdrop-blur-sm">
                    <h3 className="text-lg font-bold text-white mb-4">👤 Informações do Cliente</h3>
                    <div className="space-y-2 text-slate-300">
                      <p><span className="font-semibold text-white">Nome:</span> {comanda?.cliente || 'N/A'}</p>
                      <p><span className="font-semibold text-white">Pulseira:</span> <span className="text-purple-400 font-bold">{comanda?.pulseira || 'N/A'}</span></p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl p-12 border border-slate-700 backdrop-blur-sm text-center">
                <p className="text-6xl mb-4">🔎</p>
                <p className="text-2xl font-bold text-white mb-2">Nenhuma Comanda Selecionada</p>
                <p className="text-slate-400">Digite o número da comanda ao lado para começar</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
