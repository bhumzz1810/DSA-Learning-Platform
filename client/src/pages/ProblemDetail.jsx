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
    videoUrl: "https://www.youtube.com/embed/3yUuo7TqMW8", // Replace with your own link
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">
      <div className="flex flex-col lg:flex-row gap-8 max-w-[1400px] mx-auto w-full">
        {/* LEFT: Video + Description */}
        <div className="flex-1 space-y-6">
          <div className="aspect-video w-full rounded overflow-hidden shadow">
            <iframe
              src="https://www.youtube.com/embed/3yUuo7TqMW8"
              title="Concept Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h1 className="text-2xl font-bold mb-2">{problem.title}</h1>
            <p className="text-gray-800">{problem.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Example:</strong> {problem.example}
            </p>
          </div>
        </div>

        {/* RIGHT: Editor + Input/Output */}
        <div className="flex-1 space-y-4">
          <Editor
            height="300px"
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
          />

          {ghostSuggestion && (
            <div className="bg-gray-800 text-gray-400 px-2 py-1 rounded mt-1 text-sm italic">
              Suggestion: <span>{ghostSuggestion}</span>
              <button
                className="ml-2 text-blue-400 underline"
                onClick={() => setCode(code + ghostSuggestion)}
              >
                ⏎ Accept
              </button>
            </div>
          )}

          <div>
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
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Running..." : "Run Code"}
          </button>

          {output && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold mb-2">Output:</h3>
              <pre className="text-sm">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
