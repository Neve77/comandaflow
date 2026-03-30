import { Button } from './Button';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  footer = null,
  size = 'md',
  className = '',
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-hard ${sizes[size]} w-full animate-slide-up ${className}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-2xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer ? (
          <div className="p-6 border-t border-slate-100 flex gap-2 justify-end">
            {footer}
          </div>
        ) : (
          <div className="p-6 border-t border-slate-100 flex gap-2 justify-end">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
