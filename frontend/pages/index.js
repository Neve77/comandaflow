import { useEffect, useState } from 'react';
import Link from 'next/link';
import { setToken, clearToken, getToken } from '../services/api';
import { Button, Card, Alert, Input, Loading } from '../components';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function Home() {
  const [usuario, setUsuario] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState('garcom');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [isRegistro, setIsRegistro] = useState(false);

  useEffect(() => {
  const token = getToken();

  if (!token) return;

  try {
    const raw = localStorage.getItem("user");

    if (!raw || raw === "undefined") {
      localStorage.removeItem("user");
      return;
    }

    const parsed = JSON.parse(raw);

    if (parsed) {
      setUsuario(parsed);
      setShowLogin(false);
    }
  } catch (err) {
    console.error("User inválido no storage:", err);
    localStorage.removeItem("user");
  }
}, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      const endpoint = isRegistro ? '/auth/registro' : '/auth/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          isRegistro
            ? { nome, email, senha }
            : { email, senha }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.erro || 'Erro na autenticação');
      }

      setToken(data.token);
      localStorage.setItem('user', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      setShowLogin(false);
      setEmail('');
      setSenha('');
      setNome('');
      setErro('');
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem('user');
    setUsuario(null);
    setShowLogin(true);
  };

  // Tela de Login
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-float" style={{animationDelay: '1s'}} />

        <div className="w-full max-w-md relative z-10">
          {/* Logo Section */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="text-7xl mb-4 animate-bounce drop-shadow-lg">🍽️</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 font-display">ComandaFlow</h1>
            <p className="text-cyan-100/60 text-lg">Sistema de Comanda Digital em Tempo Real</p>
          </div>

          {/* Card de Login */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-slide-up border border-slate-700/50 hover:border-slate-600/50 transition-colors" style={{animationDelay: '0.1s'}}>
            {erro && (
              <Alert type="error" onClose={() => setErro('')} className="mb-6">
                {erro}
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {/* Toggle Registro/Login */}
              <div className="flex gap-2 bg-slate-700/50 p-1 rounded-xl border border-slate-600/50">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistro(false);
                    setErro('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    !isRegistro
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Entrar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistro(true);
                    setErro('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    isRegistro
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:text-slate-100'
                  }`}
                >
                  Registrar
                </button>
              </div>

              {/* Nome - Apenas em Registro */}
              {isRegistro && (
                <Input
                  label="Nome Completo"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome"
                  required
                  className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
                />
              )}

              {/* Email */}
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
              />

              {/* Senha */}
              <Input
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-slate-700/50 border-slate-600/50 text-white placeholder-slate-400"
              />

              {/* Role - Apenas em Registro */}
              {isRegistro && (
                <div>
                  <label className="block text-sm font-semibold text-slate-200 mb-2">Tipo de Usuário</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    <option value="garcom">👨‍💼 Garçom</option>
                    <option value="cozinha">👨‍🍳 Cozinha</option>
                    <option value="admin">⚙️ Administrador</option>
                  </select>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? '⏳ Carregando...' : isRegistro ? '📝 Registrar' : '📥 Entrar'}
              </Button>
            </form>

            {/* Demo Users */}
            <div className="mt-8 pt-8 border-t border-slate-700/50">
              <p className="text-xs text-slate-400 text-center font-semibold mb-4">📋 Credenciais de Demonstração:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-700/40 p-3 rounded-lg border border-slate-600/50 hover:border-cyan-600/50 transition-colors">
                  <p className="font-semibold text-cyan-300 mb-1">⚙️ Administrador</p>
                  <p className="text-slate-300">
                    Email: <span className="font-mono bg-slate-800/50 px-2 py-0.5 rounded text-cyan-400">admin@test.com</span>
                  </p>
                  <p className="text-slate-300">
                    Senha: <span className="font-mono bg-slate-800/50 px-2 py-0.5 rounded text-cyan-400">admin123</span>
                  </p>
                </div>
                <div className="bg-slate-700/40 p-3 rounded-lg border border-slate-600/50 hover:border-blue-600/50 transition-colors">
                  <p className="font-semibold text-blue-300 mb-1">👨‍💼 Garçom</p>
                  <p className="text-slate-300">
                    Email: <span className="font-mono bg-slate-800/50 px-2 py-0.5 rounded text-blue-400">garcom@test.com</span>
                  </p>
                  <p className="text-slate-300">
                    Senha: <span className="font-mono bg-slate-800/50 px-2 py-0.5 rounded text-blue-400">garcom123</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard após login
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full translate-y-1/2 blur-3xl animate-float pointer-events-none" style={{animationDelay: '1s'}} />

      {/* Header */}
      <div className="backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 hover-glow transition-all">
            <span className="text-4xl animate-bounce drop-shadow-lg">🍽️</span>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent font-display">ComandaFlow</h1>
              <p className="text-xs text-slate-400">Sistema de Comanda Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-100">{usuario?.nome}</p>
              <p className="text-xs text-slate-400 capitalize bg-gradient-to-r from-cyan-600/30 to-blue-600/30 px-3 py-1 rounded-full border border-slate-600/50">{usuario?.role}</p>
            </div>
            <Button variant="danger" size="sm" onClick={logout}>
              🚪 Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="mb-12 animate-slide-up">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 font-display">👋 Bem-vindo, {usuario?.nome}!</h2>
          <p className="text-slate-400 text-lg">
            {usuario?.role === 'garcom' && '📋 Selecione a interface para gerenciar pedidos'}
            {usuario?.role === 'cozinha' && '👨‍🍳 Acompanhe os pedidos em tempo real'}
            {usuario?.role === 'admin' && '⚙️ Gerencie produtos, clientes e visualize estatísticas'}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Garçom */}
          <Link href="/garcom">
            <div className="group cursor-pointer">
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-600/20 hover:scale-105 h-full">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">🧑‍💼</div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">Garçom</h3>
                <p className="text-sm text-slate-300 mb-4">Criar pedidos e gerenciar clientes</p>
                <div className="space-y-2 text-xs text-slate-400 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span> Registrar cliente
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span> Criar comanda
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-cyan-400">✓</span> Acompanhar pedidos
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-700/50 text-cyan-400 font-semibold text-sm group-hover:text-cyan-300 transition-colors">
                  Acessar →
                </div>
              </div>
            </div>
          </Link>

          {/* Cozinha */}
          <Link href="/cozinha">
            <div className="group cursor-pointer">
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-600/20 hover:scale-105 h-full">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">👨‍🍳</div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">Cozinha</h3>
                <p className="text-sm text-slate-300 mb-4">Visualizar pedidos em tempo real</p>
                <div className="space-y-2 text-xs text-slate-400 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Fila de pedidos
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Atualizar status
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-blue-400">✓</span> Sincronização real-time
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-700/50 text-blue-400 font-semibold text-sm group-hover:text-blue-300 transition-colors">
                  Acessar →
                </div>
              </div>
            </div>
          </Link>

          {/* Admin */}
          <Link href="/admin">
            <div className="group cursor-pointer">
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-purple-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-600/20 hover:scale-105 h-full">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">⚙️</div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">Admin</h3>
                <p className="text-sm text-slate-300 mb-4">Dashboard e configurações</p>
                <div className="space-y-2 text-xs text-slate-400 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> Estatísticas
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> Gerenciar produtos
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-purple-400">✓</span> Gerenciar clientes
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-700/50 text-purple-400 font-semibold text-sm group-hover:text-purple-300 transition-colors">
                  Acessar →
                </div>
              </div>
            </div>
          </Link>

          {/* Relatórios */}
          <Link href="/relatorios">
            <div className="group cursor-pointer">
              <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-amber-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-600/20 hover:scale-105 h-full">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform drop-shadow-lg">📊</div>
                <h3 className="text-xl font-bold text-slate-100 mb-2">Relatórios</h3>
                <p className="text-sm text-slate-300 mb-4">Exports e análises de dados</p>
                <div className="space-y-2 text-xs text-slate-400 mb-4">
                  <p className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Relatórios PDF
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Exportar CSV
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-amber-400">✓</span> Filtros avançados
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-700/50 text-amber-400 font-semibold text-sm group-hover:text-amber-300 transition-colors">
                  Acessar →
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Fechamento Card - New Feature */}
        <div className="mt-12 mb-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
          <h2 className="text-2xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            💳 Módulo de Pagamento
          </h2>
        </div>

        <Link href="/fechamento">
          <div className="group cursor-pointer">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 hover:border-emerald-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-600/20 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="text-6xl mb-4 drop-shadow-lg">💳</div>
                  <h3 className="text-2xl font-bold text-slate-100 mb-3">Sistema de Fechamento</h3>
                  <p className="text-slate-300 mb-6">Processo de pagamento de comandas com múltiplas formas de pagamento</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                      <p className="text-2xl mb-1">🔍</p>
                      <p className="text-xs text-slate-300">Buscar Comanda</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                      <p className="text-2xl mb-1">💰</p>
                      <p className="text-xs text-slate-300">Formas Pagto</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                      <p className="text-2xl mb-1">📜</p>
                      <p className="text-xs text-slate-300">Histórico</p>
                    </div>
                    <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                      <p className="text-2xl mb-1">✅</p>
                      <p className="text-xs text-slate-300">Fechar/Reabrir</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-700/50 text-emerald-400 font-semibold text-sm group-hover:text-emerald-300 transition-colors">
                Acessar Sistema de Pagamento →
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
