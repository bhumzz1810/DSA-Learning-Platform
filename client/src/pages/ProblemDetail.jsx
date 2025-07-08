import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { FiMaximize, FiMinimize } from "react-icons/fi";

const dummyProblems = {
  "two-sum": {
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order." +
      "\n\nLorem ipsum dolor sit amet consectetur, adipisicing elit. Quisquam optio id laborum suscipit libero reiciendis quibusdam rem est voluptas quo maiores, aut dolor laboriosam illum ipsa quia explicabo debitis cumque." +
      "\n\nDoloremque atque recusandae tempore suscipit distinctio. Ratione doloribus officiis quasi amet dignissimos aliquid impedit iure eos dolorum nihil! Quisquam optio impedit dolore earum aperiam eius libero quod sequi debitis praesentium." +
      "\n\nNecessitatibus eos enim in molestiae ducimus, deleniti sed pariatur sit assumenda fuga! Pariatur cupiditate unde porro, molestiae deserunt cumque quos consequuntur explicabo magnam omnis sapiente velit aspernatur, nostrum cum eum." +
      "\n\nQuod, excepturi veritatis. Laboriosam voluptate incidunt eaque laborum architecto harum impedit asperiores? Tenetur, ipsam, delectus ex, beatae dignissimos quas exercitationem eos culpa amet libero corporis eum perspiciatis? Quis, eius sapiente?" +
      "\n\nSit corrupti nemo illum illo possimus dolorum in eius asperiores quos. Exercitationem debitis minima eum error alias tenetur asperiores saepe facilis, excepturi corrupti? Et quisquam vel mollitia dolorem assumenda eum." +
      "\n\nOptio repudiandae at ut rerum quod possimus mollitia! Sed veniam corrupti ut nihil autem tenetur magnam itaque cupiditate fugiat impedit quas doloremque assumenda incidunt tempore repudiandae odit, minima architecto ullam!",
    example: "Input: nums = [2,7,11,15], target = 9 → Output: [0,1]",
    difficulty: "Easy",
    topic: "Array",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
    ],
    videoUrl: "https://www.youtube.com/embed/3yUuo7TqMW8",
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
  const [ghostSuggestion, setGhostSuggestion] = useState("");
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);

  const [code, setCode] = useState(`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}
console.log(twoSum(nums, target));`);

  const [input, setInput] = useState("[2, 7, 11, 15]\n9");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [ioTab, setIoTab] = useState("input");
  const [fullScreen, setFullScreen] = useState({
    description: false,
    editor: false,
  });

  useEffect(() => {
    if (activeTab === "solution" && !hint) {
      fetchHint();
    }
  }, [activeTab]);

  const fetchHint = async () => {
    setLoadingHint(true);
    try {
      const response = await new Promise(resolve =>
        setTimeout(() => resolve({
          data: {
            hint: "Use a hash map (object) to store the numbers you've seen so far along with their indices. As you iterate through the array, check if the complement (target - current number) exists in the hash map. If it does, you've found the solution!"
          }
        }), 800)
      );
      setHint(response.data.hint);
    } catch (error) {
      console.error("Failed to fetch hint:", error);
      setHint("Failed to load hint. Please try again later.");
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
            "X-RapidAPI-Key": "61e1f341afmshb0455286d61feb4p14b6fbjsnfca7595a0e85",
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
              "X-RapidAPI-Key": "61e1f341afmshb0455286d61feb4p14b6fbjsnfca7595a0e85",
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
      setOutput("Error: " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFullScreen = (section) => {
    setFullScreen(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (!problem) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Problem not found</h2>
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
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${problem.difficulty === "Easy"
              ? "bg-green-100 text-green-800"
              : problem.difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
              }`}>
              {problem.difficulty}
            </span>
            <span className="text-gray-600">Topic: {problem.topic}</span>
          </div>
        </div>

        <div className={`flex flex-col ${fullScreen.description || fullScreen.editor ? '' : 'lg:flex-row'} gap-6`}>
          {/* Left Panel - Description */}
          {(!fullScreen.editor || fullScreen.description) && (
            <div className={`${fullScreen.description ? 'w-full' : 'lg:w-1/2'} space-y-6`}>
              <div className="bg-white rounded-lg shadow p-6 relative">
                <button
                  onClick={() => toggleFullScreen("description")}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                  title={fullScreen.description ? "Minimize" : "Maximize"}
                >
                  {fullScreen.description ? <FiMinimize /> : <FiMaximize />}
                </button>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "description"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab("solution")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "solution"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      Hint
                    </button>
                    <button
                      onClick={() => setActiveTab("video")}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "video"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                        }`}
                    >
                      Video
                    </button>
                  </nav>
                </div>

                {/* Tab Content */}
                <div className={`${fullScreen.description ? 'h-[calc(100vh-200px)]' : 'h-96'} overflow-y-auto mt-4`}>
                  {activeTab === "description" && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Problem Statement</h2>
                      <pre className="text-gray-700 whitespace-pre-wrap font-sans">{problem.description}</pre>

                      <div className="space-y-2">
                        <h3 className="font-medium">Example:</h3>
                        <div className="bg-gray-100 p-3 rounded">
                          <pre className="text-sm">{problem.example}</pre>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Constraints:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {problem.constraints.map((constraint, index) => (
                            <li key={index} className="text-sm text-gray-700">{constraint}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === "solution" && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Approach</h2>
                      {loadingHint ? (
                        <div className="flex justify-center items-center py-4">
                          <svg className="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      ) : (
                        <p className="text-gray-700">{hint}</p>
                      )}
                    </div>
                  )}

                  {activeTab === "video" && (
                    <div className={`${fullScreen.description ? 'h-[calc(100vh-250px)]' : 'h-80'} w-full`}>
                      <iframe
                        src={problem.videoUrl}
                        title="Solution Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Right Panel - Editor */}
          {(!fullScreen.description || fullScreen.editor) && (
            <div className={`${fullScreen.editor ? 'w-full' : 'lg:w-1/2'} space-y-6`}>
              {/* Code Editor */}
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
                <button
                  onClick={() => toggleFullScreen("editor")}
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 transition-colors z-10 text-gray-300"
                  title={fullScreen.editor ? "Minimize" : "Maximize"}
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
                        .post("http://localhost:5000/api/suggest", { prompt: value })
                        .then((res) => {
                          setGhostSuggestion(res.data.suggestion.trim());
                        });
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

              {/* Input/Output Section */}
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setIoTab("input")}
                      className={`px-4 py-2 text-sm font-medium ${ioTab === "input"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Input
                    </button>
                    <button
                      onClick={() => setIoTab("output")}
                      className={`px-4 py-2 text-sm font-medium ${ioTab === "output"
                        ? "border-b-2 border-blue-500 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      Output
                    </button>
                  </nav>
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
                  className={`flex-1 py-3 px-4 rounded-lg font-medium text-white ${isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
                    } transition-colors flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </>
                  ) : (
                    "Run Code"
                  )}
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