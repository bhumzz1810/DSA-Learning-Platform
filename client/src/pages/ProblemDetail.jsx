import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { FiMaximize, FiMinimize } from "react-icons/fi";

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

  ${userCode}

});
`.trim();
};

export default function ProblemDetail() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [code, setCode] = useState("// Write your solution here");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ghostSuggestion, setGhostSuggestion] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [ioTab, setIoTab] = useState("input");
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [fullScreen, setFullScreen] = useState({
    description: false,
    editor: false,
  });

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000/api"
          }/problems/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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

  useEffect(() => {
    if (activeTab === "solution" && !hint && problem?.hints?.length > 0) {
      fetchHint();
    }
  }, [activeTab, problem]);

  const fetchHint = async () => {
    setLoadingHint(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setHint(problem.hints[0]);
    } catch (err) {
      setHint("Failed to load hint.");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput("Running...");
    setIoTab("output");

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
            "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
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
              "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        result = res.data;
        if (result.status.id > 2) break;
        await new Promise((r) => setTimeout(r, 1000));
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

  const toggleFullScreen = (section) => {
    setFullScreen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading)
    return <div className="p-10 text-center text-lg">Loading...</div>;

  if (error || !problem) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            {error || "Problem not found"}
          </h2>
          <Link
            to="/problems"
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
        {/* Header */}
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

        <div
          className={`flex flex-col ${
            fullScreen.description || fullScreen.editor ? "" : "lg:flex-row"
          } gap-6`}
        >
          {/* Description Panel */}
          {(!fullScreen.editor || fullScreen.description) && (
            <div
              className={`${
                fullScreen.description ? "w-full" : "lg:w-1/2"
              } space-y-6`}
            >
              <div className="bg-white rounded-lg shadow p-6 relative">
                <button
                  onClick={() => toggleFullScreen("description")}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100"
                >
                  {fullScreen.description ? <FiMinimize /> : <FiMaximize />}
                </button>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-4">
                  <nav className="flex space-x-8">
                    {["description", "solution", "video"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-1 border-b-2 text-sm font-medium ${
                          activeTab === tab
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {tab === "solution"
                          ? "Hint"
                          : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>

                <div
                  className={`${
                    fullScreen.description ? "h-[calc(100vh-200px)]" : "h-96"
                  } overflow-y-auto`}
                >
                  {activeTab === "description" && (
                    <>
                      <pre className="text-gray-700 whitespace-pre-wrap font-sans mb-4">
                        {problem.description}
                      </pre>
                      <div className="mb-4">
                        <h3 className="font-medium">Example:</h3>
                        <div className="bg-gray-100 p-3 rounded text-sm">
                          {problem.testCases?.[0]?.input} →{" "}
                          {problem.testCases?.[0]?.expectedOutput}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium">Constraints:</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                          {(problem.constraints || "")
                            .split("\n")
                            .map((line, i) => (
                              <li key={i}>{line}</li>
                            ))}
                        </ul>
                      </div>
                    </>
                  )}

                  {activeTab === "solution" && (
                    <div className="text-gray-700">
                      {loadingHint ? (
                        <div className="text-center py-4">Loading hint...</div>
                      ) : (
                        <p>{hint || "No hint available."}</p>
                      )}
                    </div>
                  )}

                  {activeTab === "video" && (
                    <div className="h-80 w-full">
                      <iframe
                        src={problem.visualAid}
                        title="Solution Video"
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-full rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Code Editor Panel */}
          {(!fullScreen.description || fullScreen.editor) && (
            <div
              className={`${
                fullScreen.editor ? "w-full" : "lg:w-1/2"
              } space-y-6`}
            >
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
                <button
                  onClick={() => toggleFullScreen("editor")}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 z-10 text-gray-300"
                >
                  {fullScreen.editor ? <FiMinimize /> : <FiMaximize />}
                </button>
                <div className="px-4 py-2 bg-gray-900 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                    <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <span className="text-gray-400 text-sm">JavaScript</span>
                </div>
                <Editor
                  height={fullScreen.editor ? "calc(100vh - 300px)" : "400px"}
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
                <div className="border-b border-gray-200 flex">
                  {["input", "output"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setIoTab(tab)}
                      className={`px-4 py-2 text-sm font-medium ${
                        ioTab === tab
                          ? "border-b-2 border-blue-500 text-blue-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                {ioTab === "input" ? (
                  <textarea
                    className="w-full p-3 text-sm font-mono border-none focus:ring-0 resize-none"
                    rows={4}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter your input here..."
                  />
                ) : (
                  <pre className="w-full p-3 text-sm font-mono bg-gray-50 overflow-auto max-h-60">
                    {output || "Run code to see output"}
                  </pre>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleRunCode}
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${
                    isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors flex items-center justify-center`}
                >
                  {isLoading ? "Running..." : "Run Code"}
                </button>
                <button
                  onClick={() => alert("Submit logic goes here")}
                  className="flex-1 py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
