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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">📊 Relatórios</h1>
            <p className="text-sm text-slate-500">Exports e análises de dados</p>
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">🗓️ Período</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  const hoje = new Date();
                  setDataInicio(new Date(hoje.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
                  setDataFim(hoje.toISOString().split('T')[0]);
                }}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-900 font-medium py-2 rounded-lg transition"
              >
                ↻ Últimos 30 dias
              </button>
            </div>
          </div>
        </div>

        {/* Relatórios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vendas */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Vendas</h3>
            <p className="text-sm text-slate-600 mb-4">Vendas em período</p>
            <div className="space-y-2">
              <button
                onClick={() => baixarRelatorio('vendas', 'pdf')}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                📄 PDF
              </button>
              <button
                onClick={() => baixarRelatorio('vendas', 'csv')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                📊 CSV
              </button>
            </div>
          </div>

          {/* Produtos */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition">
            <div className="text-4xl mb-3">🍔</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Produtos</h3>
            <p className="text-sm text-slate-600 mb-4">Análise por produto</p>
            <div className="space-y-2">
              <button
                onClick={() => baixarRelatorio('produtos', 'pdf')}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                📄 PDF
              </button>
              <button
                onClick={() => baixarRelatorio('produtos', 'csv')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                📊 CSV
              </button>
            </div>
          </div>

          {/* Clientes */}
          <div className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition">
            <div className="text-4xl mb-3">👥</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Clientes</h3>
            <p className="text-sm text-slate-600 mb-4">Lista de clientes</p>
            <div className="space-y-2">
              <button
                onClick={() => baixarRelatorio('clientes', 'pdf')}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                📄 PDF
              </button>
              <button
                onClick={() => baixarRelatorio('clientes', 'csv')}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-medium py-2 rounded-lg transition"
              >
                📊 CSV
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 bg-purple-50 border-l-4 border-purple-600 rounded-lg p-6">
          <h3 className="font-bold text-slate-900 mb-2">ℹ️ Sobre os Relatórios</h3>
          <ul className="text-slate-700 space-y-1 text-sm">
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
