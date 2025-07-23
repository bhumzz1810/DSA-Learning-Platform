const EarnedBadges = ({ badges, theme }) => {
  const themeConfig = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-800',
      secondary: 'text-gray-600',
    },
    dark: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-white',
      secondary: 'text-gray-400',
    },
    ocean: {
      bg: 'bg-blue-800',
      border: 'border-blue-700',
      text: 'text-white',
      secondary: 'text-blue-200',
    },
    forest: {
      bg: 'bg-green-800',
      border: 'border-green-700',
      text: 'text-white',
      secondary: 'text-green-200',
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!badges || badges.length === 0) {
    return (
      <div className={`rounded-xl p-6 border ${currentTheme.border} ${currentTheme.bg}`}>
        <h2 className={`text-xl font-semibold mb-4 text-left ${currentTheme.text}`}>
          Earned Badges
        </h2>
        <p className={`text-sm ${currentTheme.secondary}`}>No badges earned yet</p>
      </div>
    );
  }

  return (
    <div className={`rounded-xl p-6 border ${currentTheme.border} ${currentTheme.bg}`}>
      <h2 className={`text-xl font-semibold mb-4 text-left ${currentTheme.text}`}>
        Earned Badges ({badges.length})
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map((badge, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold">#{i+1}</span>
            </div>
            <p className={`text-xs mt-1 text-center ${currentTheme.secondary}`}>
              {badge}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EarnedBadges;