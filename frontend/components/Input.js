export const Input = ({ 
  label, 
  error, 
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`input-field ${error ? 'border-red-500 focus:ring-red-600' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-600 text-sm mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export const Select = ({ 
  label, 
  options = [],
  error,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`input-field ${error ? 'border-red-500 focus:ring-red-600' : ''} ${className}`}
        {...props}
      >
        <option value="">Selecione...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-600 text-sm mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};

export const Textarea = ({ 
  label, 
  error,
  required = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-600' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-600 text-sm mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
