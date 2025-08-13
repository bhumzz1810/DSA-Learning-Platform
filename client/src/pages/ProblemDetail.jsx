import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { FiMaximize, FiMinimize } from "react-icons/fi";
import { toast } from "react-toastify";

const wrapUserCode = (userCode) => {
  return `
const readline = require("readline");

let input = "";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on("line", (line) => {
  input += line + "\\n";
});

rl.on("close", () => {
  const lines = input.trim().split("\\n");

  // Define input and lines locally instead of using globalThis
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
  // const [ghostSuggestion, setGhostSuggestion] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [ioTab, setIoTab] = useState("input");
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [fullScreen, setFullScreen] = useState({
    description: false,
    editor: false,
  });
  const [runtime, setRuntime] = useState("");
  const [memory, setMemory] = useState("");
  const language = "javascript"; // You can later add a dropdown to change this
  const languageId = 63; // JavaScript ID for Judge0
  const [bookmarked, setBookmarked] = useState(false);
  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const navigate = useNavigate(); // inside your component
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const API_ROOT = (
    import.meta.env.VITE_API_URL ||
    "https://dsa-learning-platform-five.vercel.app"
  ).replace(/\/+$/, "");
  const API = `${API_ROOT}/api`;

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/problems/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProblem(res.data);
        setInput(res.data.testCases?.[0]?.input || "");
        setCode("// Write your solution here");
      } catch (err) {
        setError("Problem not found");
      } finally {
        setLoading(false);
      }
    };

    const fetchLastSubmission = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API}/submissions/latest/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.code) {
          setCode(res.data.code); // 👈 Set editor with last submitted code
        }
      } catch (err) {
        console.error("Failed to load last submission:", err);
      }
    };

    const checkBookmark = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/bookmarks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ids = res.data.bookmarks.map((p) => p._id);
      setBookmarked(ids.includes(id));
    };
    const fetchNote = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API}/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.note) setNote(res.data.note.content);
    };
    fetchNote();
    checkBookmark();
    fetchProblem();
    fetchLastSubmission();
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
        `${API}/judge/execute`,
        {
          language_id: languageId,
          source_code: wrappedCode,
          stdin: input,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = response.data;

      const hasError = result.stderr || result.compile_output;

      setOutput(
        hasError
          ? result.stderr || result.compile_output
          : result.stdout || "No output"
      );
      setRuntime(result.time || "-");
      setMemory(result.memory || "-");

      if (hasError) {
        toast.error("❌ Code failed to compile or run", {
          icon: "💥",
          theme: "colored",
          style: {
            background: "#b91c1c",
            color: "#fff",
          },
        });
      } else {
        toast.success("✅ Code ran successfully!", {
          icon: "⚙️",
          theme: "colored",
          style: {
            background: "#2563eb",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      console.error(error);
      setOutput(
        "Error: " + (error.response?.data?.message || "Something went wrong")
      );
      toast.error("❌ Error while running code", {
        icon: "💥",
        theme: "colored",
        style: {
          background: "#b91c1c",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ProblemDetail.jsx
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      console.log("Using token:", token ? "exists" : "missing");

      const response = await axios.post(
        `${API}/submissions`,
        {
          problemId: id,
          code,
          language,
          status: output.includes("Error") ? "Failed" : "Accepted",
          runtime,
          memory,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Submission response:", response);
      toast.success("Code submitted successfully!", {
        icon: "🚀",
        theme: "colored",
        style: {
          background: "#16a34a",
          color: "white",
        },
      });
    } catch (err) {
      console.error("FRONTEND SUBMIT ERROR:", err);
      const msg =
        err.response?.status === 409
          ? "Already accepted! Try a new problem"
          : err.response?.data?.error || err.message;
      toast.error(msg, {
        icon: "❌",
        theme: "colored",
        style: {
          background: "#dc2626",
          color: "#fff",
        },
      });

      // alert(`Submit failed: ${msg}`);
    }
  };

  const toggleFullScreen = (section) => {
    setFullScreen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleEditorWillMount = (monaco) => {
    monaco.languages.registerCompletionItemProvider("javascript", {
      triggerCharacters: [".", "(", "=", " "],
      provideCompletionItems: async (model, position) => {
        const textUntilPosition = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        try {
          const res = await axios.post(
            `${API}/suggest`,
            {
              prompt: textUntilPosition,
            },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );

          const suggestionText = res.data.suggestion.trim();

          return {
            suggestions: [
              {
                label: suggestionText.slice(0, 30),
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: suggestionText,
                insertTextRules:
                  monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                range: {
                  startLineNumber: position.lineNumber,
                  startColumn: position.column,
                  endLineNumber: position.lineNumber,
                  endColumn: position.column,
                },
              },
            ],
          };
        } catch (e) {
          console.error("Auto-suggest failed", e);
          return { suggestions: [] };
        }
      },
    });
  };

  const toggleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      if (bookmarked) {
        await axios.delete(`${API}/bookmarks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookmarked(false);
      } else {
        await axios.post(
          `${API}/bookmarks/${id}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarked(true);
      }
    } catch (err) {
      toast.error("Failed to update bookmark");
    }
  };

  const saveNote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }

    setSavingNote(true);
    try {
      await axios.post(
        `${API}/notes/${id}`,
        { content: note },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Note saved");
    } catch (err) {
      toast.error("Failed to save note");
    } finally {
      setSavingNote(false);
    }
  };
  const toEmbedUrl = (url = "") => {
    if (!url) return "";
    try {
      const u = new URL(url);
      // youtu.be/<id> -> youtube.com/embed/<id>
      if (u.hostname.includes("youtu.be")) {
        const id = u.pathname.slice(1);
        return `https://www.youtube.com/embed/${id}`;
      }
      // youtube.com/watch?v=<id> -> youtube.com/embed/<id>
      if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        if (id) return `https://www.youtube.com/embed/${id}`;
      }
      // already /embed/
      if (
        u.hostname.includes("youtube.com") &&
        u.pathname.startsWith("/embed/")
      ) {
        return url;
      }
      return url;
    } catch {
      return url;
    }
  };

  const isImageUrl = (url = "") => /\.(gif|png|jpe?g|svg)$/i.test(url);

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
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-3xl font-bold text-gray-800">
              {problem.title}
            </h1>
            <button
              onClick={toggleBookmark}
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border transition ${
                bookmarked
                  ? "bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200"
                  : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
              }`}
            >
              {bookmarked ? "🔖 Bookmarked" : "➕ Add to Bookmarks"}
            </button>
          </div>

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
                    <div className="w-full">
                      {isImageUrl(problem.visualAid) ? (
                        <img
                          src={problem.visualAid}
                          alt="Visual aid"
                          className="w-full h-auto rounded shadow"
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="relative w-full"
                          style={{ paddingTop: "56.25%" }}
                        >
                          <iframe
                            src={toEmbedUrl(problem.visualAid)}
                            title="Solution Video"
                            className="absolute left-0 top-0 h-full w-full rounded"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">
                    📝 Your Notes
                  </h2>
                  <button
                    onClick={saveNote}
                    disabled={savingNote}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    {savingNote ? "Saving..." : "Save Note"}
                  </button>
                </div>
                <textarea
                  className="w-full h-32 border border-gray-300 p-3 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Write any helpful notes for this problem..."
                />
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
                  onChange={(value) => setCode(value)}
                  beforeMount={handleEditorWillMount}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>

              {/* {ghostSuggestion && (
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
              )} */}

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
                  onClick={handleSubmit}
                  className="flex-1 py-3 px-4 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </div>

        {showLoginPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Login Required
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You must be logged in to bookmark challenges.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginPrompt(false);
                    navigate("/login");
                  }}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
