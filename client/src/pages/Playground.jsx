// components/CodePlayground.jsx
import { useState } from 'react';
import Editor from '@monaco-editor/react';
import axios from 'axios';

const Playground = () => {
  const [code, setCode] = useState(`// Welcome to DSArena Playground!
// Write any JavaScript code here and run it

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // Example code
`);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const handleRunCode = async () => {
    setIsLoading(true);
    setOutput('Running...');

    try {
      const response = await axios.post(
        "https://judge0-ce.p.rapidapi.com/submissions",
        {
          language_id: getLanguageId(language),
          source_code: code,
          stdin: input,
        },
        {
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": "your-api-key",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const token = response.data.token;
      const result = await pollSubmission(token);
      setOutput(result.stdout || result.stderr || result.compile_output || "No output");
    } catch (error) {
      setOutput("Error: " + (error.response?.data?.message || "Failed to execute code"));
    } finally {
      setIsLoading(false);
    }
  };

  const pollSubmission = async (token) => {
    let result;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "X-RapidAPI-Key": "your-api-key",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );
      result = res.data;
    } while (result.status.id <= 2);
    return result;
  };

  const getLanguageId = (lang) => {
    const languages = {
      'javascript': 63,
      'python': 71,
      'java': 62,
      'c': 50,
      'cpp': 54
    };
    return languages[lang] || 63;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-gray-800">Code Playground</h1>
        <p className="text-gray-600">
          Experiment with code outside of problem sets. Perfect for testing ideas and algorithms.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded px-3 py-1 text-sm"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="c">C</option>
              <option value="cpp">C++</option>
            </select>
            <button
              onClick={handleRunCode}
              disabled={isLoading}
              className={`px-4 py-2 rounded font-medium ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white`}
            >
              {isLoading ? 'Running...' : 'Run Code'}
            </button>
          </div>

          <div className="flex-1 border rounded-lg overflow-hidden">
            <Editor
              height="100%"
              language={language}
              theme="vs-light"
              value={code}
              onChange={setCode}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <div>
            <h3 className="font-medium text-gray-700 mb-1">Custom Input</h3>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full border rounded p-2 h-24 font-mono text-sm"
              placeholder="Enter input here..."
            />
          </div>

          <div className="flex-1 flex flex-col">
            <h3 className="font-medium text-gray-700 mb-1">Output</h3>
            <pre className="flex-1 bg-gray-100 p-3 rounded font-mono text-sm overflow-auto">
              {output || 'Output will appear here...'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;