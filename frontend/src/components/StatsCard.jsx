const StatsCard = ({ title, value, color }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    purple: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors[color]?.split(' ')[0] || 'bg-gray-100'}`}>
          <div className={`w-6 h-6 rounded ${colors[color] || 'bg-gray-400'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;