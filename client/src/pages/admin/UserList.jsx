import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?.id;
  console.log("Logged in user ID:", loggedInUserId);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/user/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  const toggleAdmin = async (id, makeAdmin) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/user/${id}/role`,
        { role: makeAdmin ? "admin" : "user" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">All Users</h2>
      <table className="w-full text-left table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Username</th>
            <th>Email</th>
            <th>XP</th>
            <th>Level</th>
            <th>Streak</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="px-4 py-2">{u.username}</td>
              <td>{u.email}</td>
              <td>{u.xp}</td>
              <td>{u.level}</td>
              <td>{u.streak}</td>
              <td>{u.role === "admin" ? "Admin" : "User"}</td>
              <td>
                {u._id === loggedInUserId ? (
                  <span className="text-gray-400 italic">Self</span>
                ) : (
                  <button
                    onClick={() => toggleAdmin(u._id, u.role !== "admin")}
                    className={`px-2 py-1 rounded ${
                      u.role === "admin"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-green-500 hover:bg-green-600"
                    } text-white`}
                  >
                    {u.role === "admin" ? "Revoke Admin" : "Make Admin"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
