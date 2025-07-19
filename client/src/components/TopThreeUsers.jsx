const TopThreeUsers = () => {
    return (
        <div className="bg-[#1e293b] rounded-xl p-6 border border-cyan-400">
            <div className="flex justify-around items-end text-center gap-4">
                {[
                    { rank: "#2", xp: "22000XP", style: "grayscale" },
                    { rank: "#1", xp: "22000XP", style: "border-2 border-yellow-400" },
                    { rank: "#3", xp: "22000XP", style: "grayscale" },
                ].map((user, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                        <div className={`w-20 h-20 rounded-full bg-gray-700 ${user.style}`} />
                        <p className="mt-2 font-bold text-lg">John Doe</p>
                        <p className="text-sm text-cyan-400">Rank: {user.rank}</p>
                        <p className="text-xl font-bold text-cyan-500 mt-1">{user.xp}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopThreeUsers;
