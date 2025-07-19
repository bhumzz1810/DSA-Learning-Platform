import React from "react";
import TopThreeUsers from "../components/TopThreeUsers";
import UserStatsCard from "../components/UserStatsCard";
import LeaderboardTable from "../components/LeaderboardTable";

const Leaderboard = () => {
    return (
        <div className="min-h-screen bg-[#0f172a] text-white px-8 py-10">
            <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Left: Top Users + Table */}
                <div className="flex-1 space-y-10">


                    <TopThreeUsers />
                    <LeaderboardTable />
                </div>

                {/* Right: User Stats */}
                <div className="w-full lg:max-w-sm">
                    <UserStatsCard />
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
