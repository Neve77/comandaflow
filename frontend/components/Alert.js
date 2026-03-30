export const Alert = ({ children, type = 'info', onClose, className = '', ...props }) => {
  const types = {
    error: 'alert-error',
    success: 'alert-success',
    warning: 'alert-warning',
    info: 'alert-info',
  };

  const icons = {
    error: '❌',
    success: '✅',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`alert ${types[type]} flex justify-between items-center gap-4 ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span className="text-lg">{icons[type]}</span>
        <div>{children}</div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-xl leading-none hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </div>
  );
};
