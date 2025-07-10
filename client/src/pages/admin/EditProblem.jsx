import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProblem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProblem(res.data);
      } catch (err) {
        console.error("Failed to fetch problem:", err);
      }
    };
    fetchProblem();
  }, [id]);

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...problem.testCases];
    updated[index][field] = value;
    setProblem({ ...problem, testCases: updated });
  };

  const handleHintChange = (index, value) => {
    const updated = [...problem.hints];
    updated[index] = value;
    setProblem({ ...problem, hints: updated });
  };

  const addHint = () => {
    setProblem({ ...problem, hints: [...problem.hints, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(`/api/problems/${id}`, problem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Problem updated!");
      navigate("/admin/problems");
    } catch (err) {
      console.error("Update failed:", err);
      alert("Error updating problem");
    }
  };

  if (!problem) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          value={problem.title}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
          required
        />

        <textarea
          name="description"
          value={problem.description}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black h-32"
          required
        />

        <input
          type="text"
          name="category"
          value={problem.category}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />

        <select
          name="difficulty"
          value={problem.difficulty}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <textarea
          name="constraints"
          value={problem.constraints}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />

        <div>
          <h4 className="font-semibold">Test Cases</h4>
          {problem.testCases.map((tc, index) => (
            <div key={index} className="mb-2">
              <input
                type="text"
                placeholder="Input"
                value={tc.input}
                onChange={(e) =>
                  handleTestCaseChange(index, "input", e.target.value)
                }
                className="border p-1 mr-2 rounded w-[45%] text-black"
              />
              <input
                type="text"
                placeholder="Expected Output"
                value={tc.expectedOutput}
                onChange={(e) =>
                  handleTestCaseChange(index, "expectedOutput", e.target.value)
                }
                className="border p-1 rounded w-[45%] text-black"
              />
            </div>
          ))}
        </div>

        <div>
          <h4 className="font-semibold">Hints</h4>
          {problem.hints.map((hint, index) => (
            <input
              key={index}
              type="text"
              value={hint}
              onChange={(e) => handleHintChange(index, e.target.value)}
              className="w-full border p-2 rounded mb-2 text-black"
            />
          ))}
          <button
            type="button"
            onClick={addHint}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Another Hint
          </button>
        </div>

        <input
          type="text"
          name="visualAid"
          value={problem.visualAid}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Update Problem
        </button>
      </form>
    </div>
  );
};

export default EditProblem;
