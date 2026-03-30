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
    if (token) {
      const user = localStorage.getItem('user');
      if (user) {
        setUsuario(JSON.parse(user));
        setShowLogin(false);
      }
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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl animate-float" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl animate-float" style={{animationDelay: '1s'}} />

        <div className="w-full max-w-md relative z-10">
          {/* Logo Section */}
          <div className="text-center mb-10 animate-slide-up">
            <div className="text-7xl mb-4 animate-bounce">🍽️</div>
            <h1 className="text-5xl font-bold text-white mb-2 font-display">ComandaFlow</h1>
            <p className="text-purple-100 text-lg">Sistema de Comanda Digital em Tempo Real</p>
          </div>

          {/* Card de Login */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-hard p-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
            {erro && (
              <Alert type="error" onClose={() => setErro('')} className="mb-6">
                {erro}
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-6">
              {/* Toggle Registro/Login */}
              <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistro(false);
                    setErro('');
                  }}
                  className={`flex-1 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
                    !isRegistro
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
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
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900'
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
              />

              {/* Senha */}
              <Input
                label="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                required
              />

              {/* Role - Apenas em Registro */}
              {isRegistro && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tipo de Usuário</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input-field"
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
            <div className="mt-8 pt-8 border-t border-slate-200">
              <p className="text-xs text-slate-600 text-center font-semibold mb-4">Credenciais de Demonstração:</p>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-700 mb-1">⚙️ Administrador</p>
                  <p className="text-slate-600">
                    Email: <span className="font-mono bg-white px-2 py-0.5 rounded">admin@test.com</span>
                  </p>
                  <p className="text-slate-600">
                    Senha: <span className="font-mono bg-white px-2 py-0.5 rounded">admin123</span>
                  </p>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <p className="font-semibold text-slate-700 mb-1">👨‍💼 Garçom</p>
                  <p className="text-slate-600">
                    Email: <span className="font-mono bg-white px-2 py-0.5 rounded">garcom@test.com</span>
                  </p>
                  <p className="text-slate-600">
                    Senha: <span className="font-mono bg-white px-2 py-0.5 rounded">garcom123</span>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
      {/* Header */}
      <div className="bg-white shadow-soft border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 hover-glow transition-all">
            <span className="text-4xl animate-bounce">🍽️</span>
            <div>
              <h1 className="text-2xl font-bold gradient-text font-display">ComandaFlow</h1>
              <p className="text-xs text-slate-500">Sistema de Comanda Digital</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900">{usuario?.nome}</p>
              <p className="text-xs text-slate-500 capitalize">{usuario?.role}</p>
            </div>
            <Button variant="danger" size="sm" onClick={logout}>
              🚪 Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12 animate-slide-up">
          <h2 className="section-title mb-2">👋 Bem-vindo, {usuario?.nome}!</h2>
          <p className="section-subtitle">
            {usuario?.role === 'garcom' && 'Selecione a interface para gerenciar pedidos'}
            {usuario?.role === 'cozinha' && 'Acompanhe os pedidos em tempo real'}
            {usuario?.role === 'admin' && 'Gerencie produtos, clientes e visualize estatísticas'}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Garçom */}
          <Link href="/garcom">
            <div className="card-hover cursor-pointer group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🧑‍💼</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Garçom</h3>
              <p className="text-sm text-slate-600 mb-4">Criar pedidos e gerenciar clientes</p>
              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Selecionar cliente
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Criar pedidos
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Acompanhar status
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-purple-600 font-semibold text-sm hover-lift">
                Acessar →
              </div>
            </div>
          </Link>

          {/* Cozinha */}
          <Link href="/cozinha">
            <div className="card-hover cursor-pointer group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👨‍🍳</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Cozinha</h3>
              <p className="text-sm text-slate-600 mb-4">Visualizar pedidos em tempo real</p>
              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Fila de pedidos
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Atualizar status
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Sincronização WebSocket
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-purple-600 font-semibold text-sm hover-lift">
                Acessar →
              </div>
            </div>
          </Link>

          {/* Admin */}
          <Link href="/admin">
            <div className="card-hover cursor-pointer group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">⚙️</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Admin</h3>
              <p className="text-sm text-slate-600 mb-4">Dashboard e configurações</p>
              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Estatísticas
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Gerenciar produtos
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Gerenciar clientes
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-purple-600 font-semibold text-sm hover-lift">
                Acessar →
              </div>
            </div>
          </Link>

          {/* Relatórios */}
          <Link href="/relatorios">
            <div className="card-hover cursor-pointer group">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📊</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Relatórios</h3>
              <p className="text-sm text-slate-600 mb-4">Exports e análises de dados</p>
              <div className="space-y-2 text-xs text-slate-500 mb-4">
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Relatórios PDF
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Exportar CSV
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-purple-600">✓</span> Filtros avançados
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-purple-600 font-semibold text-sm hover-lift">
                Acessar →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}