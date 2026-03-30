export const Card = ({
  children,
  className = '',
  hover = true,
  border = true,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-soft p-6 
        transition-all duration-300 
        ${border ? 'border border-slate-100' : ''}
        ${hover ? 'hover:shadow-medium hover:border-purple-200 hover:scale-105' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={`flex justify-between items-start mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '', ...props }) => (
  <h2 className={`text-2xl font-bold text-slate-900 ${className}`} {...props}>
    {children}
  </h2>
);

export const CardSubtitle = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-slate-600 ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent = ({ children, className = '', ...props }) => (
  <div className={`${className}`} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '', ...props }) => (
  <div className={`flex gap-2 mt-4 pt-4 border-t border-slate-100 ${className}`} {...props}>
    {children}
  </div>
);
