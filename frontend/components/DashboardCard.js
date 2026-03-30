export const DashboardCard = ({ 
  title, 
  value, 
  icon, 
  color = 'purple',
  trend = null,
  className = '' 
}) => {
  const colorVariants = {
    purple: 'from-purple-600 to-purple-700',
    blue: 'from-blue-600 to-blue-700',
    green: 'from-green-600 to-green-700',
    red: 'from-red-600 to-red-700',
    orange: 'from-orange-600 to-orange-700',
    pink: 'from-pink-600 to-pink-700',
  };

  return (
    <div className={`bg-gradient-to-br ${colorVariants[color]} rounded-xl shadow-medium p-6 text-white overflow-hidden relative group ${className}`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-white/80 text-sm font-medium">{title}</p>
            <p className="text-4xl font-bold mt-2">{value}</p>
          </div>
          <span className="text-4xl">{icon}</span>
        </div>

        {trend && (
          <div className={`text-sm font-semibold ${trend.positive ? 'text-green-200' : 'text-red-200'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}% vs mês anterior
          </div>
        )}
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
    </div>
  );
};

export const StatGrid = ({ children, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
    {children}
  </div>
);
