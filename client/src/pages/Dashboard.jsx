import React from "react";
import { FiLock, FiCode, FiArrowRightCircle } from "react-icons/fi";
import "./Dashboard.css";
import roadmapImg from "../assets/map.png"; // Adjust path as needed

const Dashboard = () => {
    const currentXP = 600;
    const targetXP = 1000;
    const progressPercent = (currentXP / targetXP) * 100;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="dashboard-subtext">Track your progress and stay motivated</p>
            </div>

            {/* Overview Cards */}
            <div className="overview-cards">
                <div className="overview-card">
                    <p className="overview-title">XP Points</p>
                    <p className="overview-value">1250</p>
                </div>
                <div className="overview-card">
                    <p className="overview-title">Level</p>
                    <p className="overview-value">7</p>
                </div>
                <div className="overview-card">
                    <p className="overview-title">Streak</p>
                    <p className="overview-value">5 days</p>
                </div>
            </div>

            {/* Roadmap */}
            <div className="roadmap-section">
                <h2>Learning Roadmap</h2>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <p className="progress-text">{currentXP} / {targetXP} XP</p>

                <div className="roadmap-steps">
                    <div className="step">
                        <FiLock className="icon active" />
                        <div>
                            <p className="step-title">Level 7: Advanced Algorithms</p>
                            <p className="step-status active">Unlocked</p>
                        </div>
                    </div>
                    <div className="step">
                        <FiLock className="icon" />
                        <div>
                            <p className="step-title">Level 8: System Design</p>
                            <p className="step-status">Upcoming</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Challenge */}
            <div className="challenge-section">
                <h2>Daily Challenge</h2>
                <div className="challenge-card">
                    <div className="challenge-info">
                        <p className="challenge-timer">Ends in 23h 59m 59s</p>
                        <h3>Binary Tree Traversal</h3>
                        <p className="challenge-desc">
                            Solve this problem to earn extra XP and maintain your streak.
                        </p>
                        <button className="btn-start">
                            Start Challenge <FiArrowRightCircle />
                        </button>
                    </div>
                    <img src={roadmapImg} alt="Challenge Visual" className="challenge-img" />
                </div>
            </div>

            {/* Quick Actions */}
            <div className="quick-actions">
                <button className="btn-green">Start Pair Coding</button>
                <button className="btn-gray">View Bookmarks</button>
            </div>

            {/* Recent Activity */}
            <div className="activity-section">
                <h2>Recent Activity</h2>
                <div className="activity-item">
                    <FiCode className="icon" />
                    <div>
                        <p className="activity-title">Problem: Merge Intervals</p>
                        <p className="activity-status success">Completed</p>
                    </div>
                </div>
                <div className="activity-item">
                    <FiCode className="icon" />
                    <div>
                        <p className="activity-title">Problem: Two Sum</p>
                        <p className="activity-status attempt">Attempted</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
