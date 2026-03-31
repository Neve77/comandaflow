import { useState, useEffect } from 'react';
import Link from 'next/link';
import * as api from '../services/api';

export default function Garcom() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    pulseira: '',
    nome: '',
    cpf: '',
    telefone: '',
  });
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    carregarClientes();
  }, []);

  const carregarClientes = async () => {
    try {
      const data = await api.clientes.listar();
      setClientes(data.clientes || []);
      setErro('');
    } catch (err) {
      setErro('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validarFormulario = () => {
    if (!formData.pulseira.trim()) return 'Pulseira é obrigatória';
    if (!formData.nome.trim()) return 'Nome é obrigatório';
    if (formData.cpf && formData.cpf.length < 11) return 'CPF deve ter 11 dígitos';
    if (formData.telefone && formData.telefone.length < 10) return 'Telefone deve ter no mínimo 10 dígitos';
    return '';
  };

  const handleRegistroCliente = async (e) => {
    e.preventDefault();

    const validacao = validarFormulario();
    if (validacao) {
      setErro(validacao);
      return;
    }

    try {
      await api.clientes.criar(
        formData.pulseira,
        formData.nome,
        formData.cpf,
        formData.telefone
      );

      setSuccess(`${formData.nome} registrado com sucesso!`);
      setFormData({ pulseira: '', nome: '', cpf: '', telefone: '' });
      setTimeout(() => setSuccess(''), 3000);

      carregarClientes();
    } catch (err) {
      setErro(err.message || 'Erro ao registrar cliente');
    }
  };

  const handleDeletarCliente = async (clienteId) => {
    if (!window.confirm('Tem certeza que deseja deletar este cliente?')) return;

    try {
      await api.clientes.deletar(clienteId);
      setSuccess('Cliente deletado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      carregarClientes();
    } catch (err) {
      setErro('Erro ao deletar cliente');
    }
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
    c.pulseira.includes(filtro) ||
    c.cpf.includes(filtro)
  );

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
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '1s'}} />

      {/* Header */}
      <div className="backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">👨‍💼 Garçom</h1>
            <p className="text-sm text-slate-400">Cadastro e gerenciamento de clientes</p>
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

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulário de Cadastro */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-6">👤 Novo Cliente</h2>

              <form onSubmit={handleRegistroCliente} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">🏷️ Pulseira</label>
                  <input
                    type="text"
                    name="pulseira"
                    value={formData.pulseira}
                    onChange={handleInputChange}
                    placeholder="Número da pulseira"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">👤 Nome</label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Nome completo"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">🆔 CPF</label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    placeholder="00000000000"
                    maxLength="11"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">📱 Telefone</label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    placeholder="(00) 99000-0000"
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium py-2 rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-blue-600/50"
                >
                  ➕ Registrar Cliente
                </button>
              </form>
            </div>
          </div>

          {/* Lista de Clientes */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <input
                type="text"
                placeholder="🔍 Buscar por nome, pulseira ou CPF..."
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/40 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {clientesFiltrados.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-slate-400">Nenhum cliente encontrado</p>
                </div>
              ) : (
                clientesFiltrados.map((cliente) => (
                  <div key={cliente.id} className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-blue-600/50 p-4 hover:border-blue-500/80 transition hover:shadow-lg hover:shadow-blue-600/20">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-slate-100 text-lg">{cliente.nome}</p>
                        <p className="text-sm text-blue-400 font-semibold">🏷️ Pulseira: {cliente.pulseira}</p>
                      </div>
                      <button
                        onClick={() => handleDeletarCliente(cliente.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-2 py-1 rounded text-sm transition border border-red-500/30"
                        title="Deletar cliente"
                      >
                        🗑️
                      </button>
                    </div>

                    <div className="space-y-1 text-sm text-slate-300 border-t border-slate-700/50 pt-3">
                      {cliente.cpf && (
                        <p className="flex items-center gap-2">
                          <span>🆔</span>{cliente.cpf}
                        </p>
                      )}
                      {cliente.telefone && (
                        <p className="flex items-center gap-2">
                          <span>📱</span>{cliente.telefone}
                        </p>
                      )}
                    </div>

                    <p className={`mt-3 text-sm font-medium ${cliente.status === 'ativo' ? 'text-emerald-400' : 'text-red-400'}`}>
                      {cliente.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
