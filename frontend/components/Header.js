import Link from 'next/link';
import { Button } from './Button';

export const Header = ({ title, subtitle, showBackButton = true, backHref = '/' }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-medium sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white font-display">{title}</h1>
          {subtitle && <p className="text-purple-100 mt-1">{subtitle}</p>}
        </div>
        {showBackButton && (
          <Link href={backHref}>
            <Button variant="secondary" className="bg-white">
              ← Voltar
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="bg-white shadow-soft border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🍽️</span>
          <div>
            <h1 className="text-xl font-bold gradient-text">ComandaFlow</h1>
            <p className="text-xs text-slate-500">Sistema de Comanda Digital</p>
          </div>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="font-semibold text-slate-900">{user.nome}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
            >
              Sair
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
