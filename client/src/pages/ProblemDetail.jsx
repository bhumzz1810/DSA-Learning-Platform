import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

const dummyProblems = {
  "two-sum": {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    example: "Input: nums = [2,7,11,15], target = 9 → Output: [0,1]",
    difficulty: "Easy",
    topic: "Array",
  },
};

const wrapUserCode = (userCode) => {
  return `
  process.stdin.resume();
  process.stdin.setEncoding("utf8");
  
  let input = "";
  process.stdin.on("data", function(chunk) {
    input += chunk;
  });
  
  process.stdin.on("end", function() {
    const lines = input.trim().split("\\n");
    const nums = JSON.parse(lines[0]);
    const target = parseInt(lines[1]);
  
    ${userCode}
  
  });
  `.trim();
};

export default function ProblemDetail() {
  const { id } = useParams();
  const problem = dummyProblems[id];

  const [code, setCode] = useState(`function twoSum(nums, target) {
  // Your code here
}`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("Running...");

    try {
      const wrappedCode = wrapUserCode(code); // << inject input-reading wrapper

      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          language_id: 63, // JavaScript
          source_code: wrappedCode,
          stdin: input,
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key":
              "61e1f341afmshb0455286d61feb4p14b6fbjsnfca7595a0e85",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = response.data.token;

      // Polling until result is ready
      let result = null;
      while (!result || result.status.id <= 2) {
        const res = await axios.get(
          `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
          {
            headers: {
              "X-RapidAPI-Key":
                "61e1f341afmshb0455286d61feb4p14b6fbjsnfca7595a0e85",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        result = res.data;
        if (result.status.id > 2) break;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setOutput(
        result.stdout || result.stderr || result.compile_output || "No output"
      );
    } catch (error) {
      console.error(error);
      setOutput("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!problem) {
    return (
      <div className="p-6">
        <h2 className="text-red-600 text-xl">Problem not found</h2>
        <Link to="/problems" className="text-blue-500 underline">
          Back to problems
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{problem.title}</h1>
      <p className="mb-4 text-gray-700">{problem.description}</p>
      <p className="mb-2 text-sm">
        <strong>Example:</strong> {problem.example}
      </p>

      <div className="mt-6">
        <h2 className="font-semibold mb-2">Your Code:</h2>
        <Editor
          height="300px"
          defaultLanguage="javascript"
          value={code}
          onChange={(value) => setCode(value)}
          theme="vs-dark"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-2 font-semibold">Custom Input:</label>
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      <button
        onClick={handleRunCode}
        className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? "Running..." : "Run Code"}
      </button>

      {output && (
        <div className="mt-4 bg-white p-4 rounded shadow">
          <h3 className="font-bold mb-2">Output:</h3>
          <pre>{output}</pre>
        </div>
      )}
    </div>
  );
}
