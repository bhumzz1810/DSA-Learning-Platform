const LeaderboardTable = () => {
    const rows = Array(7).fill({
        name: "John Doe Sebastian",
        level: 12,
        xp: "10000 XP",
    });

    return (
        <table className="w-full text-left text-white text-sm bg-[#1e293b] rounded-xl overflow-hidden">
            <thead className="text-cyan-400 border-b border-cyan-400">
                <tr>
                    <th className="py-3 px-4">Rank</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Level</th>
                    <th className="py-3 px-4">XP Earned</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((user, idx) => (
                    <tr key={idx} className="border-t border-gray-700 hover:bg-gray-800">
                        <td className="py-3 px-4">{idx + 4}</td>
                        <td className="py-3 px-4">{user.name}</td>
                        <td className="py-3 px-4">{user.level}</td>
                        <td className="py-3 px-4">{user.xp}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default LeaderboardTable;
