import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ghostSuggestion, setGhostSuggestion] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/problems/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProblem(res.data);
        setInput(res.data.testCases?.[0]?.input || "");
        setCode("// Write your solution here");
      } catch (err) {
        setError("Problem not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [id]);

  const wrapUserCode = (userCode) =>
    `
process.stdin.resume();
process.stdin.setEncoding("utf8");

let input = "";
process.stdin.on("data", function(chunk) {
  input += chunk;
});

process.stdin.on("end", function() {
  const lines = input.trim().split("\\n");

  ${userCode}
});`.trim();

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("Running...");

    try {
      const wrappedCode = wrapUserCode(code);

      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          language_id: 63,
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
      setOutput(
        "Error: " + (error.response?.data?.message || "Something went wrong")
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (loading)
    return <div className="p-10 text-center text-lg">Loading...</div>;

  if (error) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <Link
            to={`/problems/${problem._id}`}
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to problems
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{problem.title}</h1>
          <div className="flex items-center space-x-4 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                problem.difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : problem.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {problem.difficulty}
            </span>
            <span className="text-gray-600">Topic: {problem.category}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-1/2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Problem Statement</h2>
              <p className="text-gray-700 mb-4">{problem.description}</p>
              <h3 className="font-medium">Constraints:</h3>
              <ul className="list-disc pl-5 space-y-1">
                {(problem.constraints || "").split("\n").map((line, i) => (
                  <li key={i} className="text-sm text-gray-700">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <div className="px-4 py-2 bg-gray-900 flex justify-between items-center">
                <div className="flex space-x-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                </div>
                <span className="text-gray-400 text-sm">JavaScript</span>
              </div>
              <Editor
                height="400px"
                defaultLanguage="javascript"
                value={code}
                onChange={(value) => {
                  setCode(value);
                  if (value && value.length % 5 === 0) {
                    axios
                      .post("http://localhost:5000/api/suggest", {
                        prompt: value,
                      })
                      .then((res) =>
                        setGhostSuggestion(res.data.suggestion.trim())
                      );
                  }
                }}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                }}
              />
            </div>

            {ghostSuggestion && (
              <div className="bg-gray-800 text-gray-300 p-3 rounded-lg shadow text-sm flex justify-between items-center">
                <div>
                  <span className="text-gray-400 italic">Suggestion: </span>
                  <span>{ghostSuggestion}</span>
                </div>
                <button
                  onClick={() => setCode(code + ghostSuggestion)}
                  className="ml-2 px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs"
                >
                  Accept
                </button>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
                    Input
                  </button>
                </nav>
              </div>
              <textarea
                className="w-full p-3 text-sm font-mono border-none focus:ring-0 resize-none"
                rows={4}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your input here..."
              />
            </div>

            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } transition-colors flex items-center justify-center`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Running...
                </>
              ) : (
                "Run Code"
              )}
            </button>

            {output && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button className="px-4 py-2 text-sm font-medium border-b-2 border-blue-500 text-blue-600">
                      Output
                    </button>
                  </nav>
                </div>
                <pre className="p-3 text-sm font-mono bg-gray-50 overflow-auto max-h-60">
                  {output}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
