import React from "react";
import { Link } from "react-router-dom";

const problems = [
  {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
  },
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
  },
  // Add more problems here
];

export default function Problems() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">DSA Problems</h1>
      <div className="grid gap-4 max-w-3xl mx-auto">
        {problems.map((problem) => (
          <div
            key={problem.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{problem.title}</h2>
              <p className="text-sm text-gray-600">
                Topic: {problem.topic} | Difficulty:{" "}
                <span
                  className={`font-bold ${
                    problem.difficulty === "Easy"
                      ? "text-green-600"
                      : problem.difficulty === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {problem.difficulty}
                </span>
              </p>
            </div>
            <Link
              to={`/problems/${problem.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Solve
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
