import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../services/api';

/**
 * Formatar valor monetário com segurança
 * @param {number|string|null|undefined} value - Valor a formatar
 * @returns {string} Valor formatado com 2 casas decimais
 */
const formatMoney = (value) => {
  const num = parseFloat(value) || 0;
  return isNaN(num) ? '0.00' : num.toFixed(2);
};

export default function Admin() {
  const [tab, setTab] = useState('dashboard');
  const [dashboard, setDashboard] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');

  const [novoForm, setNovoForm] = useState({
    nome: '',
    preco: '',
    categoria: '',
  });

  useEffect(() => {
    carregarDados();
  }, [tab]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      if (tab === 'dashboard') {
        const data = await api.dashboard.overview();
        setDashboard(data);
      } else if (tab === 'produtos') {
        const data = await api.produtos.listar();
        setProdutos(data.produtos || []);
      } else if (tab === 'clientes') {
        const data = await api.clientes.listar();
        setClientes(data.clientes || []);
      }
      setErro('');
    } catch (err) {
      setErro('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const criarProduto = async (e) => {
    e.preventDefault();
    if (!novoForm.nome || !novoForm.preco || !novoForm.categoria) {
      setErro('Preencha todos os campos');
      return;
    }

    try {
      await api.produtos.criar(
        novoForm.nome,
        parseFloat(novoForm.preco),
        novoForm.categoria
      );
      setSuccess(`${novoForm.nome} criado com sucesso!`);
      setNovoForm({ nome: '', preco: '', categoria: '' });
      setTimeout(() => setSuccess(''), 3000);
      carregarDados();
    } catch (err) {
      setErro(err.message);
    }
  };

  const deletarProduto = async (produtoId) => {
    if (!window.confirm('Tem certeza que deseja deletar este produto?')) {
      return;
    }

    try {
      await api.produtos.deletar(produtoId);
      setSuccess('Produto deletado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      carregarDados();
    } catch (err) {
      setErro('Erro ao deletar produto: ' + (err.message || 'Erro desconhecido'));
    }
  };

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
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '1s'}} />

      {/* Header */}
      <div className="backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">⚙️ Admin</h1>
            <p className="text-sm text-slate-400">Dashboard e gerenciamento</p>
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
        <div className="fixed top-20 right-4 bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg shadow-lg max-w-md backdrop-blur-sm">
          {erro}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 px-4 py-3 rounded-lg shadow-lg max-w-md backdrop-blur-sm">
          {success}
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-700/50 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'produtos', icon: '🍔', label: 'Produtos' },
            { id: 'clientes', icon: '👥', label: 'Clientes' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 font-medium border-b-2 transition whitespace-nowrap ${
                tab === t.id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-slate-400 hover:text-slate-300'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <Link href="/relatorios">
            <button className="px-4 py-2 font-medium border-b-2 border-transparent text-slate-400 hover:text-purple-400 transition whitespace-nowrap">
              📈 Relatórios
            </button>
          </Link>
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && dashboard && (
          <div>
            <h2 className="text-2xl font-bold text-slate-100 mb-6">📊 Resumo Hoje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-blue-600/50 p-6 hover:border-blue-500/80 transition-all hover:shadow-lg hover:shadow-blue-600/20">
                <p className="text-slate-400 text-sm font-medium">Pedidos</p>
                <p className="text-3xl font-bold text-blue-400 mt-2">{dashboard.resumo?.pedidosHoje || 0}</p>
                <p className="text-xs text-slate-500 mt-2">📦 Hoje</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-emerald-600/50 p-6 hover:border-emerald-500/80 transition-all hover:shadow-lg hover:shadow-emerald-600/20">
                <p className="text-slate-400 text-sm font-medium">Vendas</p>
                <p className="text-3xl font-bold text-emerald-400 mt-2">R$ {formatMoney(dashboard.resumo?.vendasHoje)}</p>
                <p className="text-xs text-slate-500 mt-2">💰 Faturamento</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-purple-600/50 p-6 hover:border-purple-500/80 transition-all hover:shadow-lg hover:shadow-purple-600/20">
                <p className="text-slate-400 text-sm font-medium">Clientes</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">{dashboard.resumo?.clientesAtivos || 0}</p>
                <p className="text-xs text-slate-500 mt-2">👥 Ativos</p>
              </div>
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-red-600/50 p-6 hover:border-red-500/80 transition-all hover:shadow-lg hover:shadow-red-600/20">
                <p className="text-slate-400 text-sm font-medium">Pendentes</p>
                <p className="text-3xl font-bold text-red-400 mt-2">{dashboard.resumo?.pedidosPendentes || 0}</p>
                <p className="text-xs text-slate-500 mt-2">⏳ Filas</p>
              </div>
            </div>

            {dashboard.produtosMais && dashboard.produtosMais.length > 0 && (
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-slate-700/50 p-6">
                <h3 className="text-lg font-bold text-slate-100 mb-4">🔥 Produtos Mais Vendidos</h3>
                <div className="space-y-3">
                  {dashboard.produtosMais.map((p, idx) => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg border border-slate-600/30 hover:border-slate-500/50 transition">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-bold text-slate-400">#{idx + 1}</span>
                        <div>
                          <p className="font-medium text-slate-100">{p.nome}</p>
                          <p className="text-xs text-slate-400">{p.total_vendido} vendidos</p>
                        </div>
                      </div>
                      <p className="font-bold text-emerald-400">R$ {formatMoney(p.total_vendas)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Produtos Tab */}
        {tab === 'produtos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-bold text-slate-100 mb-4">🍔 Produtos Cadastrados</h2>
              <div className="space-y-3">
                {produtos.map((p) => (
                  <div key={p.id} className="bg-slate-800/40 backdrop-blur-xl rounded-lg p-4 border border-slate-700/50 hover:border-slate-600/50 transition flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-100">{p.nome}</p>
                      <p className="text-xs text-slate-400">{p.categoria}</p>
                    </div>
                    <div className="text-right flex items-center gap-3">
                      <div>
                        <p className="font-bold text-emerald-400">R$ {formatMoney(p.preco)}</p>
                        <p className="text-xs text-slate-400">{p.ativo ? '✅ Ativo' : '❌ Inativo'}</p>
                      </div>
                      <button
                        onClick={() => deletarProduto(p.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-3 py-2 rounded-lg text-sm font-medium transition border border-red-500/30"
                        title="Deletar produto"
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário */}
            <div>
              <h2 className="text-lg font-bold text-slate-100 mb-4">➕ Novo Produto</h2>
              <form onSubmit={criarProduto} className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-slate-700/50 p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nome</label>
                  <input
                    type="text"
                    value={novoForm.nome}
                    onChange={(e) => setNovoForm({ ...novoForm, nome: e.target.value })}
                    placeholder="Ex: Água"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoForm.preco}
                    onChange={(e) => setNovoForm({ ...novoForm, preco: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Categoria</label>
                  <select
                    value={novoForm.categoria}
                    onChange={(e) => setNovoForm({ ...novoForm, categoria: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition"
                  >
                    <option value="">Selecione</option>
                    <option value="Bebida">Bebida</option>
                    <option value="Comida">Comida</option>
                    <option value="Sobremesa">Sobremesa</option>
                    <option value="Entrada">Entrada</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-purple-600/50"
                >
                  ➕ Criar Produto
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Clientes Tab */}
        {tab === 'clientes' && (
          <div>
            <h2 className="text-lg font-bold text-slate-100 mb-4">👥 Clientes Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.map((c) => (
                <div key={c.id} className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-purple-600/50 p-6 hover:border-purple-500/80 transition hover:shadow-lg hover:shadow-purple-600/20">
                  <p className="font-bold text-slate-100 text-lg">{c.nome}</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-300">
                    <p className="flex items-center gap-2">
                      <span>📱</span>{c.telefone}
                    </p>
                    <p className="flex items-center gap-2">
                      <span>🆔</span>{c.cpf}
                    </p>
                    <p className="font-bold text-purple-400 flex items-center gap-2">
                      <span>🏷️</span>{c.pulseira}
                    </p>
                  </div>
                  <p className={`mt-3 text-sm font-medium ${c?.status === 'ativo' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {c?.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
