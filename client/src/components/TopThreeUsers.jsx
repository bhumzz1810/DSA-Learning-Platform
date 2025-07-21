const TopThreeUsers = ({ topUsers, theme }) => {
  const themeConfig = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-300',
      text: 'text-gray-800',
      accent: 'text-blue-600',
    },
    dark: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-white',
      accent: 'text-cyan-400',
    },
    ocean: {
      bg: 'bg-blue-800',
      border: 'border-blue-700',
      text: 'text-white',
      accent: 'text-cyan-300',
    },
    forest: {
      bg: 'bg-green-800',
      border: 'border-green-700',
      text: 'text-white',
      accent: 'text-emerald-300',
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!topUsers || topUsers.length < 3) return null;

  return (
    <div className={`rounded-xl p-6 ${currentTheme.bg} border ${currentTheme.border}`}>
      <div className="flex justify-around items-end text-center gap-4">
        {[
          { rank: 2, style: "grayscale" },
          { rank: 1, style: "border-2 border-yellow-400" },
          { rank: 3, style: "grayscale" },
        ].map((user, idx) => {
          const userData = topUsers[user.rank - 1] || {};
          return (
            <div key={idx} className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-full bg-gray-700 ${user.style}`} />
              <p className={`mt-2 font-bold text-lg ${currentTheme.text}`}>
                {userData.username || 'User'}
              </p>
              <p className={`text-sm ${currentTheme.accent}`}>Rank: #{user.rank}</p>
              <p className={`text-xl font-bold ${currentTheme.accent} mt-1`}>
                {userData.xp || 0}XP
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopThreeUsers;