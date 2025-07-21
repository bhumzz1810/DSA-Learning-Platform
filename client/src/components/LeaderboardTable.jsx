const LeaderboardTable = ({ leaderboard, theme }) => {
  const themeConfig = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200',
      accent: 'text-blue-600',
      hover: 'hover:bg-gray-100',
    },
    dark: {
      bg: 'bg-gray-800',
      text: 'text-white',
      border: 'border-gray-700',
      accent: 'text-cyan-400',
      hover: 'hover:bg-gray-700',
    },
    ocean: {
      bg: 'bg-blue-800',
      text: 'text-white',
      border: 'border-blue-700',
      accent: 'text-cyan-300',
      hover: 'hover:bg-blue-700',
    },
    forest: {
      bg: 'bg-green-800',
      text: 'text-white',
      border: 'border-green-700',
      accent: 'text-emerald-300',
      hover: 'hover:bg-green-700',
    }
  };

  const currentTheme = themeConfig[theme] || themeConfig.dark;

  if (!leaderboard?.topUsers) return null;

  return (
    <table className={`w-full text-left text-sm rounded-xl overflow-hidden ${currentTheme.bg}`}>
      <thead className={`${currentTheme.accent} border-b ${currentTheme.border}`}>
        <tr>
          <th className="py-3 px-4">Rank</th>
          <th className="py-3 px-4">Name</th>
          <th className="py-3 px-4">Level</th>
          <th className="py-3 px-4">XP Earned</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.topUsers.map((user, idx) => (
          <tr 
            key={idx} 
            className={`border-t ${currentTheme.border} ${currentTheme.hover}`}
          >
            <td className={`py-3 px-4 ${currentTheme.text}`}>{idx + 1}</td>
            <td className={`py-3 px-4 ${currentTheme.text}`}>{user.username}</td>
            <td className={`py-3 px-4 ${currentTheme.text}`}>{user.level}</td>
            <td className={`py-3 px-4 ${currentTheme.text}`}>{user.xp} XP</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;