import React from "react";
import ProfileCard from "../components/ProfileCard";
import LearningProgress from "../components/LearningProgress";
import XPProgressChart from "../components/XPProgressChart";
import EarnedBadges from "../components/EarnedBadges";

const Profilepage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-[#1B2434] to-[#0D131D] text-white px-6 md:px-16 py-10 space-y-12">
            <h1 className="text-3xl font-bold">Profile</h1>

                <ProfileCard />

            <div className="grid md:grid-cols-2 gap-8">
                <div className="flex flex-col space-y-6">
                    <LearningProgress />
                    <XPProgressChart />
                </div>

                <EarnedBadges />
            </div>
        </div>

    );
};

export default Profilepage;
