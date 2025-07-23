const XPProgressChart = ({ user, theme }) => {
  const themeConfig = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-800',
      positive: 'text-green-600',
      chartBg: 'bg-gray-200',
    },
    dark: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-white',
      positive: 'text-green-400',
      chartBg: 'bg-gray-700',
    },
    ocean: {
      bg: 'bg-blue-800',
      border: 'border-blue-700',
      text: 'text-white',
      positive: 'text-green-300',
      chartBg: 'bg-blue-700',
    },
    forest: {
      bg: 'bg-green-800',
      border: 'border-green-700',
      text: 'text-white',
      positive: 'text-green-300',
      chartBg: 'bg-green-700',
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!user) return null;

  // Calculate XP change (mock data - replace with real calculations)
  const xpChange = 10; // This should be calculated from user's recent activity

  return (
    <div className={`rounded-xl p-6 border ${currentTheme.border} ${currentTheme.bg}`}>
      <h2 className={`text-xl text-left font-semibold mb-4 ${currentTheme.text}`}>
        XP Progress
      </h2>
      <div className="flex items-end gap-2 mb-2">
        <p className={`text-4xl font-bold ${currentTheme.text}`}>
          {user.xp}
        </p>
        <p className={`${currentTheme.positive} text-sm mb-2`}>
          +{xpChange}%
        </p>
      </div>
      <div className={`h-40 ${currentTheme.chartBg} rounded flex items-center justify-center ${currentTheme.text}`}>
        [ XP Line Graph Placeholder ]
      </div>
      <div className={`flex justify-between text-xs mt-3 ${currentTheme.text} opacity-70`}>
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map(month => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
};

export default XPProgressChart;