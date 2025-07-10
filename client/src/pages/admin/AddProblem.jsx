// src/pages/admin/AddProblem.jsx
import React, { useState } from "react";
import axios from "axios";

const AddProblem = () => {
  const [problem, setProblem] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "Easy",
    constraints: "",
    testCases: [{ input: "", expectedOutput: "" }],
    hints: [""],
    visualAid: "",
  });

  const handleChange = (e) => {
    setProblem({ ...problem, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updated = [...problem.testCases];
    updated[index][field] = value;
    setProblem({ ...problem, testCases: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // assuming you store auth token here
      const res = await axios.post("/api/problems", problem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Problem created!");
    } catch (err) {
      console.error(err);
      alert("Error creating problem");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Create New Problem</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Problem Title"
          value={problem.title}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={problem.description}
          onChange={handleChange}
          className="w-full border p-2 rounded h-32"
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category (e.g. Arrays)"
          value={problem.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="difficulty"
          value={problem.difficulty}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <textarea
          name="constraints"
          placeholder="Constraints"
          value={problem.constraints}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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
                className="border p-1 mr-2 rounded w-[45%]"
              />
              <input
                type="text"
                placeholder="Expected Output"
                value={tc.expectedOutput}
                onChange={(e) =>
                  handleTestCaseChange(index, "expectedOutput", e.target.value)
                }
                className="border p-1 rounded w-[45%]"
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
              placeholder={`Hint ${index + 1}`}
              value={hint}
              onChange={(e) => {
                const updatedHints = [...problem.hints];
                updatedHints[index] = e.target.value;
                setProblem({ ...problem, hints: updatedHints });
              }}
              className="w-full border p-2 rounded mb-2"
            />
          ))}
          <button
            type="button"
            onClick={() =>
              setProblem({ ...problem, hints: [...problem.hints, ""] })
            }
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Another Hint
          </button>
        </div>

        <input
          type="text"
          name="visualAid"
          placeholder="GIF/Video URL"
          value={problem.visualAid}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Problem
        </button>
      </form>
    </div>
  );
};

export default AddProblem;
