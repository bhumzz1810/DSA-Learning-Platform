import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    fetchProblems();
  }, [showArchived]);

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/problems?archived=${showArchived}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (Array.isArray(res.data)) {
        setProblems(res.data);
      } else {
        setProblems([]);
      }
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setProblems([]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to archive this problem?"))
      return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProblems(problems.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Archive failed:", err);
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `/api/problems/${id}/restore`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProblems(problems.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {showArchived ? "Archived Problems" : "All Problems"}
        </h2>
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="text-blue-600 hover:underline text-sm"
        >
          {showArchived ? "← Back to Active" : "View Archived"}
        </button>
      </div>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Title</th>
            <th className="text-left p-2">Category</th>
            <th className="text-left p-2">Difficulty</th>
            <th className="text-left p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr key={problem._id} className="border-t">
              <td className="p-2">{problem.title}</td>
              <td className="p-2">{problem.category || "—"}</td>
              <td className="p-2">{problem.difficulty}</td>
              <td className="p-2 space-x-2">
                {showArchived ? (
                  <button
                    onClick={() => handleRestore(problem._id)}
                    className="text-green-600 hover:underline"
                  >
                    Restore
                  </button>
                ) : (
                  <>
                    <Link
                      to={`/admin/problems/edit/${problem._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="text-red-600 hover:underline"
                    >
                      Archive
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {problems.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No problems found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList;
