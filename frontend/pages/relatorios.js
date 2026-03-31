import { useState } from 'react';
import Link from 'next/link';
import { dashboard, getToken } from '../services/api';

export default function Relatorios() {
  const [dataInicio, setDataInicio] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [dataFim, setDataFim] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [success, setSuccess] = useState('');

  const token = getToken();

  const baixarRelatorio = async (tipo, formato) => {
    try {
      setLoading(true);
      setSuccess('');
      setErro('');

      const url = `http://localhost:5000/relatorios/${tipo}/${formato}?dataInicio=${dataInicio}&dataFim=${dataFim}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Erro ao baixar');

      const blob = await response.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = urlBlob;
      link.download = `relatorio_${tipo}_${Date.now()}.${formato === 'pdf' ? 'pdf' : 'csv'}`;
      link.click();
      window.URL.revokeObjectURL(urlBlob);

      setSuccess(`✅ ${tipo.charAt(0).toUpperCase() + tipo.slice(1)} baixado!`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-float pointer-events-none" style={{animationDelay: '1s'}} />

      {/* Header */}
      <div className="backdrop-blur-sm bg-slate-800/30 border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">📊 Relatórios</h1>
            <p className="text-sm text-slate-400">Exports e análises de dados</p>
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
      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Filtros */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-slate-700/50 p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-100 mb-4">🗓️ Período</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent transition"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  const hoje = new Date();
                  setDataInicio(new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                  setDataFim(hoje.toISOString().split('T')[0]);
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-medium py-2 rounded-lg transition shadow-lg hover:shadow-amber-600/50"
              >
                ↻ Últimos 30 dias
              </button>
            </div>
          </div>
        </div>

        {/* Relatórios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vendas */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-amber-600/50 p-6 hover:border-amber-500/80 transition hover:shadow-lg hover:shadow-amber-600/20">
            <div className="text-4xl mb-3 drop-shadow-lg">💰</div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Vendas</h3>
            <p className="text-sm text-slate-400 mb-4">Vendas em período</p>
            <div className="space-y-2">
              <button
                onClick={() => baixarRelatorio('vendas', 'pdf')}
                disabled={loading}
                className="w-full bg-red-600/80 hover:bg-red-700/80 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition border border-red-600/50"
              >
                📄 PDF
              </button>
              <button
                onClick={() => baixarRelatorio('vendas', 'csv')}
                disabled={loading}
                className="w-full bg-emerald-600/80 hover:bg-emerald-700/80 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition border border-emerald-600/50"
              >
                📊 CSV
              </button>
            </div>
          </div>

          {/* Produtos */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-amber-600/50 p-6 hover:border-amber-500/80 transition hover:shadow-lg hover:shadow-amber-600/20">
            <div className="text-4xl mb-3 drop-shadow-lg">🍔</div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Produtos</h3>
            <p className="text-sm text-slate-400 mb-4">Análise por produto</p>
            <div className="space-y-2">
              <button
                onClick={() => baixarRelatorio('produtos', 'pdf')}
                disabled={loading}
                className="w-full bg-red-600/80 hover:bg-red-700/80 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition border border-red-600/50"
              >
                📄 PDF
              </button>
              <button
                onClick={() => baixarRelatorio('produtos', 'csv')}
                disabled={loading}
                className="w-full bg-emerald-600/80 hover:bg-emerald-700/80 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition border border-emerald-600/50"
              >
                📊 CSV
              </button>
            </div>
          </div>

          {/* Clientes */}
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-xl border border-amber-600/50 p-6 hover:border-amber-500/80 transition hover:shadow-lg hover:shadow-amber-600/20">
            <div className="text-4xl mb-3 drop-shadow-lg">👥</div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Clientes</h3>
            <p className="text-sm text-slate-400 mb-4">Lista de clientes</p>
            <div className="space-y-2">
              <button
                onClick={() => baixarRelatorio('clientes', 'pdf')}
                disabled={loading}
                className="w-full bg-red-600/80 hover:bg-red-700/80 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition border border-red-600/50"
              >
                📄 PDF
              </button>
              <button
                onClick={() => baixarRelatorio('clientes', 'csv')}
                disabled={loading}
                className="w-full bg-emerald-600/80 hover:bg-emerald-700/80 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition border border-emerald-600/50"
              >
                📊 CSV
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-amber-500/20 border border-amber-600/50 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="font-bold text-slate-100 mb-2">ℹ️ Sobre os Relatórios</h3>
          <ul className="text-slate-300 space-y-1 text-sm">
            <li>✅ <strong>PDF:</strong> Relatórios formatados prontos para impressão</li>
            <li>✅ <strong>CSV:</strong> Dados em planilha para análise</li>
            <li>✅ <strong>Período Customizável:</strong> Escolha qualquer data</li>
            <li>✅ <strong>Download Automático:</strong> Arquivo salvo em Downloads</li>
            <li>✅ <strong>Seguro:</strong> Apenas usuários autenticados têm acesso</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
