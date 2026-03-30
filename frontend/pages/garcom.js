import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../services/api';
import { garcom, conectarSocket } from '../services/socket';

export default function Garcom() {
  const [produtos, setProdutos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');
  const [total, setTotal] = useState(0);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    carregarDados();
    conectarSocket();
  }, []);

  useEffect(() => {
    const novoTotal = carrinho.reduce((sum, item) => sum + (item.preco * item.quantidade), 0);
    setTotal(novoTotal);
  }, [carrinho]);

  const carregarDados = async () => {
    try {
      const [produtosRes, clientesRes] = await Promise.all([
        api.produtos.listar(),
        api.clientes.listar(),
      ]);

      setProdutos(produtosRes.produtos || []);
      setClientes(clientesRes.clientes || []);
    } catch (err) {
      setErro('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const adicionarAoCarrinho = (produto) => {
    const existente = carrinho.find((item) => item.produto_id === produto.id);

    if (existente) {
      setCarrinho(
        carrinho.map((item) =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      );
    } else {
      setCarrinho([
        ...carrinho,
        {
          produto_id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
        },
      ]);
    }
    setSuccess(`${produto.nome} adicionado!`);
    setTimeout(() => setSuccess(''), 2000);
  };

  const removerDoCarrinho = (produto_id) => {
    setCarrinho(carrinho.filter((item) => item.produto_id !== produto_id));
  };

  const atualizarQuantidade = (produto_id, quantidade) => {
    if (quantidade <= 0) {
      removerDoCarrinho(produto_id);
      return;
    }
    setCarrinho(
      carrinho.map((item) =>
        item.produto_id === produto_id ? { ...item, quantidade } : item
      )
    );
  };

  const enviarPedido = async () => {
    if (!clienteSelecionado) {
      setErro('Selecione um cliente');
      return;
    }
    if (carrinho.length === 0) {
      setErro('Carrinho vazio');
      return;
    }

    try {
      const itens = carrinho.map((item) => ({
        produto_id: item.produto_id,
        quantidade: item.quantidade,
      }));

      const resultado = await api.pedidos.criar(clienteSelecionado.pulseira, itens);
      garcom.enviarPedido(resultado.id);

      setSuccess(`✓ Pedido #${resultado.id} enviado! Total: R$ ${resultado.total.toFixed(2)}`);
      setCarrinho([]);
      setClienteSelecionado(null);
      setErro('');

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErro(err.message);
    }
  };

  const produtosFiltrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    p.categoria.toLowerCase().includes(filtro.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-slate-900">👨‍💼 Garçom</h1>
            <p className="text-sm text-slate-500">Gerenciar pedidos</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Lado Esquerdo - Produtos */}
          <div className="lg:col-span-2">
            {/* Busca/Filtro */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Buscar produtos..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>

            {/* Grid de Produtos */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {produtosFiltrados.map((produto) => (
                <button
                  key={produto.id}
                  onClick={() => adicionarAoCarrinho(produto)}
                  className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition transform hover:scale-105 text-left border border-slate-200"
                >
                  <div className="text-3xl mb-2">🍕</div>
                  <p className="font-semibold text-slate-900 text-sm">{produto.nome}</p>
                  <p className="text-xs text-slate-500 mb-2">{produto.categoria}</p>
                  <p className="text-lg font-bold text-purple-600">R$ {parseFloat(produto.preco).toFixed(2)}</p>
                </button>
              ))}
            </div>

            {produtosFiltrados.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">Nenhum produto encontrado</p>
              </div>
            )}
          </div>

          {/* Lado Direito - Carrinho */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-4">🛒 Carrinho</h2>

            {/* Seletor de Cliente */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Cliente</label>
              <select
                value={clienteSelecionado?.id || ''}
                onChange={(e) => {
                  const cliente = clientes.find((c) => c.id === parseInt(e.target.value));
                  setClienteSelecionado(cliente);
                  setErro('');
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 text-sm"
              >
                <option value="">Selecione...</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome} (Pulseira: {cliente.pulseira})
                  </option>
                ))}
              </select>
            </div>

            {/* Itens do Carrinho */}
            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
              {carrinho.length === 0 ? (
                <p className="text-center text-slate-500 text-sm py-8">Carrinho vazio</p>
              ) : (
                carrinho.map((item) => (
                  <div key={item.produto_id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">{item.nome}</p>
                      <p className="text-xs text-slate-500">R$ {parseFloat(item.preco).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => atualizarQuantidade(item.produto_id, item.quantidade - 1)}
                        className="bg-slate-200 hover:bg-slate-300 w-6 h-6 rounded flex items-center justify-center text-sm"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantidade}</span>
                      <button
                        onClick={() => atualizarQuantidade(item.produto_id, item.quantidade + 1)}
                        className="bg-slate-200 hover:bg-slate-300 w-6 h-6 rounded flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removerDoCarrinho(item.produto_id)}
                        className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Total */}
            <div className="border-t border-slate-200 pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-slate-700">Total:</span>
                <span className="text-2xl font-bold text-purple-600">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            {/* Botão Enviar */}
            <button
              onClick={enviarPedido}
              disabled={!clienteSelecionado || carrinho.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold py-3 rounded-lg transition"
            >
              📤 Enviar Pedido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
