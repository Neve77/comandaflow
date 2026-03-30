export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md hover:shadow-lg focus:ring-purple-600',
    secondary: 'bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 focus:ring-purple-600',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-md focus:ring-red-600',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-md focus:ring-green-600',
    ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
