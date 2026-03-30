import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../services/api';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-slate-600">Carregando...</p>
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
            <h1 className="text-2xl font-bold text-slate-900">⚙️ Admin</h1>
            <p className="text-sm text-slate-500">Dashboard e gerenciamento</p>
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
        <div className="fixed top-20 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          {erro}
        </div>
      )}
      {success && (
        <div className="fixed top-20 right-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          {success}
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-slate-200">
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'produtos', icon: '🍔', label: 'Produtos' },
            { id: 'clientes', icon: '👥', label: 'Clientes' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 font-medium border-b-2 transition ${
                tab === t.id
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <Link href="/relatorios">
            <button className="px-4 py-2 font-medium border-b-2 border-transparent text-slate-600 hover:text-purple-600">
              📈 Relatórios
            </button>
          </Link>
        </div>

        {/* Dashboard Tab */}
        {tab === 'dashboard' && dashboard && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-6">Resumo Hoje</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600">
                <p className="text-slate-600 text-sm font-medium">Pedidos</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{dashboard.resumo?.pedidosHoje || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-600">
                <p className="text-slate-600 text-sm font-medium">Vendas</p>
                <p className="text-3xl font-bold text-green-600 mt-2">R$ {(dashboard.resumo?.vendasHoje || 0).toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                <p className="text-slate-600 text-sm font-medium">Clientes</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{dashboard.resumo?.clientesAtivos || 0}</p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-600">
                <p className="text-slate-600 text-sm font-medium">Pendentes</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{dashboard.resumo?.pedidosPendentes || 0}</p>
              </div>
            </div>

            {dashboard.produtosMais && dashboard.produtosMais.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Produtos Mais Vendidos</h3>
                <div className="space-y-3">
                  {dashboard.produtosMais.map((p) => (
                    <div key={p.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-900">{p.nome}</p>
                        <p className="text-xs text-slate-500">{p.total_vendido} vendidos</p>
                      </div>
                      <p className="font-bold text-green-600">R$ {parseFloat(p.total_vendas || 0).toFixed(2)}</p>
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
              <h2 className="text-lg font-bold text-slate-900 mb-4">Produtos Cadastrados</h2>
              <div className="space-y-3">
                {produtos.map((p) => (
                  <div key={p.id} className="bg-white rounded-lg p-4 shadow-sm flex justify-between items-center">
                    <div>
                      <p className="font-medium text-slate-900">{p.nome}</p>
                      <p className="text-xs text-slate-500">{p.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">R$ {parseFloat(p.preco).toFixed(2)}</p>
                      <p className="text-xs text-slate-500">{p.ativo ? '✅ Ativo' : '❌ Inativo'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formulário */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4">Novo Produto</h2>
              <form onSubmit={criarProduto} className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={novoForm.nome}
                    onChange={(e) => setNovoForm({ ...novoForm, nome: e.target.value })}
                    placeholder="Ex: Água"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Preço</label>
                  <input
                    type="number"
                    step="0.01"
                    value={novoForm.preco}
                    onChange={(e) => setNovoForm({ ...novoForm, preco: e.target.value })}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Categoria</label>
                  <select
                    value={novoForm.categoria}
                    onChange={(e) => setNovoForm({ ...novoForm, categoria: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
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
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-medium py-2 rounded-lg hover:from-purple-700 hover:to-purple-800 transition"
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
            <h2 className="text-lg font-bold text-slate-900 mb-4">Clientes Ativos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.map((c) => (
                <div key={c.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-600">
                  <p className="font-bold text-slate-900 text-lg">{c.nome}</p>
                  <div className="mt-3 space-y-1 text-sm text-slate-600">
                    <p>📱 {c.telefone}</p>
                    <p>🆔 {c.cpf}</p>
                    <p className="font-bold text-purple-600">🏷️ {c.pulseira}</p>
                  </div>
                  <p className={`mt-3 text-sm font-medium ${c.status === 'ativo' ? 'text-green-600' : 'text-red-600'}`}>
                    {c.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
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
