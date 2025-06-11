import React from "react";
import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiCode,
    FiAward,
    FiUsers,
    FiMap,
    FiSettings,
} from "react-icons/fi";

const navItems = [
    { label: "Dashboard", to: "/dashboard", icon: <FiHome /> },
    { label: "Problems", to: "/problems", icon: <FiCode /> },
    { label: "Contests", to: "/contests", icon: <FiAward /> },
    { label: "Pair Coding", to: "/pair-coding", icon: <FiUsers /> },
    { label: "Roadmap", to: "/roadmap", icon: <FiMap /> },
    { label: "Settings", to: "/settings", icon: <FiSettings /> },
];

const Sidebar = () => {
    return (
        <aside className="h-screen w-64 bg-white border-r shadow-sm p-4 flex flex-col gap-2">
            {navItems.map((item) => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-150 ${isActive
                            ? "bg-gray-100 text-blue-600 font-semibold"
                            : "text-gray-600 hover:bg-gray-100"
                        }`
                    }
                >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                </NavLink>
            ))}
        </aside>
    );
};

export default Sidebar;
