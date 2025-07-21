const UserStatsCard = ({ user, leaderboard, theme }) => {
    const themeConfig = {
        light: {
            bg: 'bg-white',
            text: 'text-gray-800',
            accent: 'text-blue-600',
            secondary: 'text-gray-600',
            button: 'bg-blue-600 hover:bg-blue-700 text-white',
            highlight: 'text-orange-600',
            cardBg: 'bg-gray-100'
        },
        dark: {
            bg: 'bg-gray-800',
            text: 'text-white',
            accent: 'text-cyan-400',
            secondary: 'text-gray-400',
            button: 'bg-cyan-600 hover:bg-cyan-700 text-white',
            highlight: 'text-orange-400',
            cardBg: 'bg-gray-900'
        },
        ocean: {
            bg: 'bg-blue-800',
            text: 'text-white',
            accent: 'text-cyan-300',
            secondary: 'text-blue-200',
            button: 'bg-cyan-500 hover:bg-cyan-600 text-white',
            highlight: 'text-orange-300',
            cardBg: 'bg-blue-900'
        },
        forest: {
            bg: 'bg-green-800',
            text: 'text-white',
            accent: 'text-emerald-300',
            secondary: 'text-green-200',
            button: 'bg-emerald-500 hover:bg-emerald-600 text-white',
            highlight: 'text-orange-300',
            cardBg: 'bg-green-900'
        }
    };

    const currentTheme = themeConfig[theme] || themeConfig.dark;

    if (!user) return null;

    // Get rank from leaderboard data - with multiple fallbacks
    const userRank = leaderboard?.yourRank || '--';


    return (
        <div className={`rounded-xl p-6 space-y-6 relative ${currentTheme.bg}`}>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center text-white text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                    <h2 className={`text-xl font-bold ${currentTheme.accent}`}>
                        {user.username}
                    </h2>
                    <p className={`text-sm ${currentTheme.secondary} -mt-1`}>
                        @{user.email.split('@')[0]}
                    </p>
                </div>
            </div>

            <div className={`p-4 rounded-md text-center ${currentTheme.cardBg}`}>
                <p className={`text-sm ${currentTheme.highlight}`}>
                    XP Earned (Today)
                </p>
                <p className={`text-2xl font-bold ${currentTheme.text}`}>
                    {user.xp}XP
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-md text-center ${currentTheme.cardBg}`}>
                    <p className={`text-sm ${currentTheme.highlight}`}>
                        Current Rank
                    </p>
                    <p className={`text-xl font-bold ${currentTheme.text}`}>
                        #{userRank}
                    </p>
                </div>
                <div className={`p-4 rounded-md text-center ${currentTheme.cardBg}`}>
                    <p className={`text-sm ${currentTheme.highlight}`}>
                        Current Level
                    </p>
                    <p className={`text-xl font-bold ${currentTheme.text}`}>
                        {user.level}
                    </p>
                </div>
            </div>

            <div className={`p-4 rounded-md text-center ${currentTheme.cardBg}`}>
                <p className={`text-sm ${currentTheme.highlight}`}>
                    Total XP Earned
                </p>
                <p className={`text-xl font-bold ${currentTheme.text}`}>
                    {user.xp}XP
                </p>
            </div>

            <a
                href="/dashboard"
                className={`w-full ${currentTheme.button} py-2 rounded-full font-semibold flex justify-center items-center mb-2`}
            >
                View Full Profile
            </a>


            <a
                href="/Problems"
                className={`w-full ${currentTheme.button} py-2 rounded-full font-semibold flex justify-center items-center mb-2`}
            >
                Earn More XP
            </a>

        </div>
    );
};

export default UserStatsCard;