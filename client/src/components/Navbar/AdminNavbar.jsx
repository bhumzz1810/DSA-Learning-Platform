// components/Navbar/AdminNavbar.jsx
import { useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/admin/problems")}
      >
        Admin Dashboard
      </h1>
      <div className="space-x-4">
        <button onClick={() => navigate("/admin/problems")}>
          View Problems
        </button>
        <button onClick={() => navigate("/admin/add-problem")}>
          Add Problem
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
