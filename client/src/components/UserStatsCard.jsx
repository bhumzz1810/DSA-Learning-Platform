const UserStatsCard = () => {
    return (
        <div className="bg-[#1e293b] rounded-xl p-6 space-y-6 relative">

            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-500" />
                <div>
                    <h2 className="text-xl  text-cyan-400 font-bold ">John Doe Sebastian</h2>
                    <p className="text-sm text-gray-400 -mt-4">@johndoe</p>
                </div>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-md text-center">
                <p className="text-sm  text-orange-400">XP Earned (Today)</p>
                <p className="text-2xl font-bold text-white">2000XP</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0f172a] p-4 rounded-md text-center">
                    <p className="text-sm text-orange-400">Current Rank</p>
                    <p className="text-xl font-bold text-white">#7</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-md text-center">
                    <p className="text-sm  text-orange-400">Current Level</p>
                    <p className="text-xl font-bold text-white">12</p>
                </div>
            </div>

            <div className="bg-[#0f172a] p-4 rounded-md text-center">
                <p className="text-sm  text-orange-400">XP Earned</p>
                <p className="text-xl font-bold text-white">10000XP</p>
            </div>

            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-full font-semibold">
                View Full Profile
            </button>
            <button className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 rounded-full font-semibold">
                Earn More XP
            </button>
        </div>
    );
};

export default UserStatsCard;
