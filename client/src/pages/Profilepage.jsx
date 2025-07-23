import React, { useEffect, useState } from "react";
import ProfileCard from "../components/ProfileCard";
import LearningProgress from "../components/LearningProgress";
import XPProgressChart from "../components/XPProgressChart";
import EarnedBadges from "../components/EarnedBadges";
import { useNavigate } from "react-router-dom";

const Profilepage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch("http://localhost:5000/api/dashboard", {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDashboardData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#1B2434] to-[#0D131D] text-white px-6 md:px-16 py-10">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p>Loading profile data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#1B2434] to-[#0D131D] text-white px-6 md:px-16 py-10">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-red-500">Error loading profile: {error}</p>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#1B2434] to-[#0D131D] text-white px-6 md:px-16 py-10">
        <h1 className="text-3xl font-bold">Profile</h1>
        <p>No profile data available</p>
      </div>
    );
  }

  const enhancedUser = {
    ...dashboardData.user,
    rank: dashboardData.leaderboard.yourRank,
    subscription: dashboardData.user.subscription
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#1B2434] to-[#0D131D] text-white px-6 md:px-16 py-10 space-y-12">
      <h1 className="text-3xl font-bold">Profile</h1>

      <ProfileCard 
        user={enhancedUser} 
        leaderboard={dashboardData.leaderboard} 
        theme="dark" 
      />

      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col space-y-6">
          <LearningProgress user={dashboardData.user} theme="dark" />
          <XPProgressChart user={dashboardData.user} theme="dark" />
        </div>

        <EarnedBadges badges={dashboardData.user.badges} theme="dark" />
      </div>
    </div>
  );
};

export default Profilepage;