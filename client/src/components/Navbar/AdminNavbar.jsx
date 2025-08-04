import { useNavigate } from "react-router-dom";
import { useTheme } from "../RT_Pairing/ThemeContext"; // Adjust path as needed

const AdminNavbar = () => {
  const navigate = useNavigate();
  const { theme } = useTheme(); // Get current theme from context

  // Theme configuration
  const themeStyles = {
    light: {
      bg: "bg-gray-100",
      text: "text-gray-800",
      button: "bg-indigo-600 hover:bg-indigo-700",
      logout: "bg-red-600 hover:bg-red-700"
    },
    dark: {
      bg: "bg-gray-800",
      text: "text-white",
      button: "bg-indigo-500 hover:bg-indigo-600",
      logout: "bg-red-500 hover:bg-red-600"
    },
    ocean: {
      bg: "bg-blue-900",
      text: "text-white",
      button: "bg-cyan-600 hover:bg-cyan-700",
      logout: "bg-red-500 hover:bg-red-600"
    },
    forest: {
      bg: "bg-green-800",
      text: "text-white",
      button: "bg-emerald-600 hover:bg-emerald-700",
      logout: "bg-red-500 hover:bg-red-600"
    }
  };

  const currentTheme = themeStyles[theme] || themeStyles.dark;

  return (
    <nav className={`${currentTheme.bg} ${currentTheme.text} p-4 flex justify-between items-center shadow-md`}>
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/admin/problems")}
      >
        Admin Dashboard
      </h1>
      <div className="space-x-4">
        <button 
          onClick={() => navigate("/admin/problems")}
          className={`${currentTheme.button} px-3 py-1 rounded text-white`}
        >
          View Problems
        </button>
        <button 
          onClick={() => navigate("/admin/add-problem")}
          className={`${currentTheme.button} px-3 py-1 rounded text-white`}
        >
          Add Problem
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className={`${currentTheme.logout} px-3 py-1 rounded text-white`}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;