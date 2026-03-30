export const Badge = ({ children, variant = 'default', className = '', ...props }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-700',
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <span
      className={`
        inline-block px-3 py-1 rounded-full text-sm font-semibold
        transition-all duration-200
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};
