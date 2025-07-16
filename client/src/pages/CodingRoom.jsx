import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket, connectSocket, disconnectSocket } from "../socket";
import Editor from "@monaco-editor/react";
import FileExplorer from "../components/RT_Pairing/FileExplorer";
import UserList from "../components/RT_Pairing/UserList";
import Chat from "../components/RT_Pairing/Chat";
import { useTheme } from "../components/RT_Pairing/ThemeContext";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const CodingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const monacoRef = useRef(null);

  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [cursors, setCursors] = useState({});
  const [deleteNotification, setDeleteNotification] = useState(null);
  const [deletedPaths, setDeletedPaths] = useState(() => {
    const saved = localStorage.getItem(`deletedPaths_${location.search}`);
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const [roomId, setRoomId] = useState(null);
  const [alias, setAlias] = useState(null);

  const activeFileRef = useRef(activeFile);
  const outputEndRef = useRef(null);

  useEffect(() => {
    outputEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  useEffect(() => {
    localStorage.setItem(`deletedPaths_${location.search}`, JSON.stringify([...deletedPaths]));
  }, [deletedPaths, location.search]);

  const handleExitSession = () => {
    if (socket.connected) {
      socket.emit("leave-room", { roomId, alias });
      disconnectSocket();
    }
    navigate("/join-room");
  };

  const handleFileSelect = (file) => {
    if (file.isDirectory) return;
    setActiveFile(file);
    setCode(file.content || "");
    const extension = file.name.split('.').pop().toLowerCase();
    const languageMap = {
      js: 'javascript',
      json: 'json',
      html: 'html',
      css: 'css',
      txt: 'plaintext'
    };
    setLanguage(languageMap[extension] || 'javascript');
    if (socket.connected) {
      socket.emit("request-file", { filePath: file.path });
      socket.emit("cursor-update", { filePath: file.path, position: { lineNumber: 1, column: 1 } });
    }
  };

  const handleCodeChange = (newCode, event) => {
    setCode(newCode);
    if (socket.connected && activeFileRef.current) {
      socket.emit("code-change", {
        filePath: activeFileRef.current.path,
        newCode,
      });
    }
  };

  const handleCursorChange = (e) => {
    if (socket.connected && activeFileRef.current) {
      socket.emit("cursor-update", {
        filePath: activeFileRef.current.path,
        position: e.position,
        userId: alias,
      });
    }
  };

  const handleSendMessage = (message) => {
    if (socket.connected && alias) {
      socket.emit("send-message", {
        message,
        alias,
        timestamp: new Date().toISOString(),
      });
    }
  };

  const handleDownloadFile = () => {
    if (!activeFile) return;
    try {
      const element = document.createElement("a");
      const fileBlob = new Blob([code], { type: "text/plain" });
      element.href = URL.createObjectURL(fileBlob);
      element.download = activeFile.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleDownloadAllFiles = async () => {
    if (files.length === 0) {
      return;
    }
    try {
      const zip = new JSZip();
      files.forEach((file) => {
        if (!file.isDirectory && !deletedPaths.has(file.path)) {
          zip.file(file.name, file.content || "");
        }
      });
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `coding-room-${roomId || "files"}.zip`);
    } catch (error) {
      console.error("Download all error:", error);
    }
  };

  const handleNewFile = () => {
    const newFileName = `Untitled-${Date.now()}.js`;
    const newFile = {
      name: newFileName,
      path: `/${newFileName}`,
      isDirectory: false,
      content: "// New file\n",
      type: "text/javascript",
      lastModified: Date.now(),
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFile(newFile);
    setCode(newFile.content);
    setLanguage("javascript");

    if (socket.connected && roomId) {
      socket.emit("files-added", {
        roomId,
        files: [
          {
            name: newFile.name,
            path: newFile.path,
            type: newFile.type,
            isDirectory: false,
            content: newFile.content,
          },
        ],
      });
    }
  };

  const handleDeleteFile = (file) => {
    if (!file || file.isDirectory || !file.path) {
      return;
    }

    const deleteRequestId = Date.now().toString();

    if (socket.connected && roomId) {
      socket.emit("file-delete-request", {
        roomId,
        filePath: file.path,
        fileName: file.name,
        requester: alias,
        deleteRequestId,
      });

      // Add system message to chat
      setMessages((prev) => [
        ...prev,
        {
          alias: "System",
          message: `${alias} requested to delete file: ${file.name}`,
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ]);

      setFiles((prev) => prev.filter((f) => f.path !== file.path));
      setDeletedPaths((prev) => new Set([...prev, file.path]));
      if (activeFile?.path === file.path) {
        setActiveFile(null);
        setCode("");
      }
    } else {
      setFiles((prev) => prev.filter((f) => f.path !== file.path));
      setDeletedPaths((prev) => new Set([...prev, file.path]));
      if (activeFile?.path === file.path) {
        setActiveFile(null);
        setCode("");
      }
      setMessages((prev) => [
        ...prev,
        {
          alias: "System",
          message: `${alias} deleted file: ${file.name}`,
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ]);
    }
  };

  const handleDeleteResponse = (filePath, approve, deleteRequestId) => {
    if (socket.connected && roomId) {
      socket.emit("file-delete-response", {
        roomId,
        filePath,
        approve,
        responder: alias,
        deleteRequestId,
      });

      // Add system message to chat
      setMessages((prev) => [
        ...prev,
        {
          alias: "System",
          message: `${alias} ${approve ? "approved" : "rejected"} the deletion request`,
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ]);
    }
    setDeleteNotification(null);
  };

  const handleRenameFile = (file, newName) => {
    if (!file || file.isDirectory || !newName || newName === file.name) {
      return;
    }
    const extension = file.name.split('.').pop();
    const newFileName = newName.endsWith(`.${extension}`) ? newName : `${newName}.${extension}`;
    const newPath = `/${newFileName}`;
    const existingFile = files.find((f) => f.path === newPath);
    if (existingFile) {
      return;
    }

    setFiles((prev) =>
      prev.map((f) =>
        f.path === file.path ? { ...f, name: newFileName, path: newPath } : f
      )
    );
    if (activeFile?.path === file.path) {
      setActiveFile({ ...file, name: newFileName, path: newPath });
    }
    if (socket.connected && roomId) {
      socket.emit("file-renamed", {
        roomId,
        oldPath: file.path,
        newPath,
        newName: newFileName,
      });
    }
  };

  const handleClearOutput = () => {
    setOutput("");
  };

  const handleFormatCode = () => {
    if (!monacoRef.current || !activeFile) return;
    monacoRef.current.getAction("editor.action.formatDocument").run();
  };

  const clearRoomData = () => {
    setFiles([]);
    setActiveFile(null);
    setCode("");
    setMessages((prev) => [
      ...prev,
      {
        alias: "System",
        message: "Room has been reset as all users left",
        timestamp: new Date().toISOString(),
        isSystem: true,
      },
    ]);
    setDeletedPaths(new Set());
    localStorage.removeItem(`deletedPaths_${location.search}`);
  };

  const handleRunCode = () => {
    if (!activeFile || language !== "javascript") {
      setOutput("Local execution only supports JavaScript");
      return;
    }

    setIsRunning(true);
    setOutput("Running code...");

    try {
      try {
        new Function(code);
      } catch (syntaxErr) {
        setOutput(`Syntax Error: ${syntaxErr.message}`);
        setIsRunning(false);
        return;
      }

      let outputBuffer = [];
      const originalConsoleLog = console.log;
      console.log = (...args) => {
        outputBuffer.push(
          args
            .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : String(arg)))
            .join(" ")
        );
      };

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Execution timed out after 5 seconds")), 5000);
      });

      const executionPromise = new Promise((resolve) => {
        const fn = new Function(code);
        resolve(fn());
      });

      Promise.race([executionPromise, timeoutPromise])
        .then(() => {
          console.log = originalConsoleLog;
          setOutput(outputBuffer.join("\n") || "Code executed successfully");
        })
        .catch((err) => {
          console.log = originalConsoleLog;
          setOutput(`Error: ${err.message}`);
        })
        .finally(() => {
          setIsRunning(false);
        });

      if (socket.connected) {
        socket.emit("code-executed", {
          roomId,
          output: outputBuffer.join("\n") || "No output",
          executedBy: alias,
        });
      }
    } catch (err) {
      setOutput(`Error: ${err.message}`);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const room = queryParams.get("roomId");
    const userAlias = queryParams.get("alias");

    if (!room || !userAlias) {
      navigate("/join-room");
      return;
    }

    setRoomId(room);
    setAlias(userAlias);
    connectSocket(room, userAlias);

    const onConnect = () => {
      setConnectionStatus("connected");
    };

    const onDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    const onConnectError = (error) => {
      setConnectionStatus("error");
    };

    const onUsersUpdated = (updatedUsers) => {
      const activeUsers = updatedUsers.filter((user) => user.isActive);
      setUsers(activeUsers);
    };

    const onFilesUpdated = (updatedFiles) => {
      setFiles((prev) => {
        const filteredFiles = updatedFiles.filter((f) => !deletedPaths.has(f.path));
        return filteredFiles;
      });
      if (
        activeFileRef.current &&
        !updatedFiles.some((f) => f.path === activeFileRef.current.path)
      ) {
        setActiveFile(null);
        setCode("");
      }
    };

    const onFileContent = ({ filePath, content }) => {
      if (activeFileRef.current?.path === filePath) {
        setCode(content);
      }
    };

    const onCodeUpdate = ({ filePath, newCode }) => {
      if (activeFileRef.current?.path === filePath) {
        setCode(newCode);
      }
    };

    const onNewMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onRoomCleared = () => {
      clearRoomData();
    };

    const onReconnect = () => {
      setConnectionStatus("connected");
      if (room && userAlias) {
        socket.emit("join-room", { roomId: room, alias: userAlias });
        if (activeFileRef.current) {
          socket.emit("request-file", { filePath: activeFileRef.current.path });
        }
      }
    };

    const onCodeExecuted = ({ output, executedBy }) => {
      setOutput(`${executedBy} executed code:\n${output}`);
    };

    const onFileDeleteRequest = ({ filePath, fileName, requester, deleteRequestId }) => {
      if (alias !== requester) {
        setDeleteNotification({ filePath, fileName, requester, deleteRequestId });
        setTimeout(() => {
          if (deleteNotification?.deleteRequestId === deleteRequestId) {
            handleDeleteResponse(filePath, true, deleteRequestId);
            setDeleteNotification(null);
          }
        }, 5000);
      }
    };

    const onFileDeleted = ({ filePath, fileName, deleteRequestId, requester, responder }) => {
      setDeletedPaths((prev) => new Set([...prev, filePath]));
      setFiles((prev) => prev.filter((f) => f.path !== filePath));
      if (activeFileRef.current?.path === filePath) {
        setActiveFile(null);
        setCode("");
      }
      setDeleteNotification(null);

      // Add system message to chat
      setMessages((prev) => [
        ...prev,
        {
          alias: "System",
          message: `File ${fileName} was ${responder ? `deleted (approved by ${responder})` : "deleted"}`,
          timestamp: new Date().toISOString(),
          isSystem: true,
        },
      ]);
    };

    const onFileRenamed = ({ oldPath, newPath, newName }) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.path === oldPath ? { ...f, path: newPath, name: newName } : f
        )
      );
      if (activeFileRef.current?.path === oldPath) {
        setActiveFile((prev) => ({ ...prev, path: newPath, name: newName }));
      }
    };

    const onCursorUpdate = ({ filePath, position, userId }) => {
      if (filePath === activeFileRef.current?.path && userId !== alias) {
        setCursors((prev) => ({
          ...prev,
          [userId]: position,
        }));
      }
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);
    socket.on("reconnect", onReconnect);
    socket.on("users-updated", onUsersUpdated);
    socket.on("files-updated", onFilesUpdated);
    socket.on("file-content", onFileContent);
    socket.on("code-update", onCodeUpdate);
    socket.on("new-message", onNewMessage);
    socket.on("room-cleared", onRoomCleared);
    socket.on("code-executed", onCodeExecuted);
    socket.on("file-delete-request", onFileDeleteRequest);
    socket.on("file-deleted", onFileDeleted);
    socket.on("file-renamed", onFileRenamed);
    socket.on("cursor-update", onCursorUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("reconnect", onReconnect);
      socket.off("users-updated", onUsersUpdated);
      socket.off("files-updated", onFilesUpdated);
      socket.off("file-content", onFileContent);
      socket.off("code-update", onCodeUpdate);
      socket.off("new-message", onNewMessage);
      socket.off("room-cleared", onRoomCleared);
      socket.off("code-executed", onCodeExecuted);
      socket.off("file-delete-request", onFileDeleteRequest);
      socket.off("file-deleted", onFileDeleted);
      socket.off("file-renamed", onFileRenamed);
      socket.off("cursor-update", onCursorUpdate);

      if (socket.connected) {
        socket.emit("leave-room", { roomId: room, alias: userAlias });
        disconnectSocket();
      }
    };
  }, [location, navigate]);

  const handleEditorDidMount = (editor, monaco) => {
    monacoRef.current = editor;
    editor.onDidChangeCursorPosition(handleCursorChange);
  };

  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "json", label: "JSON" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "plaintext", label: "Plain Text" },
  ];

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <header
        className={`p-4 flex justify-between items-center border-b ${
          theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
        }`}
      >
        <div>
          <h1 className="text-xl font-bold">Pair Coding</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm">
              Status:{" "}
              <span
                className={
                  connectionStatus === "connected" ? "text-green-500" : "text-red-500"
                }
              >
                {connectionStatus.toUpperCase()}
              </span>
            </p>
            {roomId && <p className="text-sm">Room: {roomId}</p>}
            <p className="text-sm">
              Users Online: <span className="font-semibold">{users.length}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
  <button
    className={`px-3 py-2 rounded-md flex items-center justify-between gap-2 w-28 ${
      theme === "dark" ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"
    }`}
    onClick={() => setShowThemeDropdown((prev) => !prev)}
  >
    Theme
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>
  {showThemeDropdown && (
    <div
      className={`absolute right-0 mt-2 w-32 rounded-md shadow-md z-20 ${
        theme === "dark" ? "bg-gray-800" : "bg-white"
      }`}
    >
      <button
        onClick={() => {
          toggleTheme("light");
          setShowThemeDropdown(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Light
      </button>
      <button
        onClick={() => {
          toggleTheme("dark");
          setShowThemeDropdown(false);
        }}
        className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        Dark
      </button>
    </div>
  )}
</div>


          <button
            onClick={handleExitSession}
            className={`px-4 py-2 rounded transition-colors ${
              theme === "dark" ? "bg-red-700 hover:bg-red-600" : "bg-red-600 hover:bg-red-500"
            } text-white`}
          >
            Exit Session
          </button>

          <div className="flex space-x-2">
            <button
              onClick={handleNewFile}
              className={`px-4 py-2 rounded transition-colors ${
                theme === "dark" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-indigo-500 hover:bg-indigo-600"
              } text-white`}
            >
              New File
            </button>
            <button
              onClick={handleDownloadFile}
              disabled={!activeFile || isLoading}
              className={`px-4 py-2 rounded transition-colors ${
                !activeFile || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Download
            </button>
            <button
              onClick={handleDownloadAllFiles}
              disabled={files.length === 0 || isLoading}
              className={`px-4 py-2 rounded transition-colors ${
                files.length === 0 || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              Download All
            </button>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-2 py-1 rounded ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {languageOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleFormatCode}
              disabled={!activeFile || isLoading}
              className={`px-4 py-2 rounded transition-colors ${
                !activeFile || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-yellow-500 hover:bg-yellow-600"
              } text-white`}
            >
              Format
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`w-64 border-r ${
            theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <FileExplorer
            key={files.length}
            files={files}
            onFileSelect={handleFileSelect}
            onFileDelete={handleDeleteFile}
            onFileRename={handleRenameFile}
            activeFile={activeFile}
            theme={theme}
          />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {activeFile ? (
            <>
              <div className="flex-1 relative">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  onChange={handleCodeChange}
                  onMount={handleEditorDidMount}
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
                {Object.entries(cursors).map(([userId, position]) => (
                  <div
                    key={userId}
                    style={{
                      position: "absolute",
                      top: `${position.lineNumber * 20}px`,
                      left: `${position.column * 8}px`,
                      width: "2px",
                      height: "20px",
                      backgroundColor: "rgba(255, 0, 0, 0.5)",
                      zIndex: 10,
                    }}
                    title={`${userId}'s cursor`}
                  />
                ))}
              </div>
              <div
                className={`border-t ${
                  theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
                }`}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Output</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleRunCode}
                        disabled={!activeFile || isRunning || language !== "javascript"}
                        className={`px-4 py-2 rounded transition-colors ${
                          !activeFile || isRunning || language !== "javascript"
                            ? "bg-gray-400 cursor-not-allowed"
                            : theme === "dark"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                      >
                        {isRunning ? "Running..." : "Run Code"}
                      </button>
                      <button
                        onClick={handleClearOutput}
                        className={`px-4 py-2 rounded transition-colors ${
                          theme === "dark"
                            ? "bg-gray-600 hover:bg-gray-500"
                            : "bg-gray-300 hover:bg-gray-400"
                        } text-white`}
                      >
                        Clear Output
                      </button>
                    </div>
                  </div>
                  <pre
                    className={`p-3 rounded overflow-auto max-h-40 ${
                      theme === "dark" ? "bg-gray-700 text-gray-100" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {output || "No output"}
                    <div ref={outputEndRef} />
                  </pre>
                  {language !== "javascript" && (
                    <p className="text-sm text-yellow-600 mt-2">
                      Note: Local execution only supports JavaScript. For other languages, use an external execution service.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">Select a file to start coding</p>
            </div>
          )}
         {deleteNotification && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div
      className={`p-6 rounded shadow-lg max-w-sm w-full ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-lg font-semibold mb-2">File Deletion Request</h2>
      <p className="mb-4">
        <span className="font-medium">{deleteNotification.requester}</span> wants to delete{" "}
        <span className="font-medium">{deleteNotification.fileName}</span>.
        <br />
        Do you want to approve this?
      </p>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() =>
            handleDeleteResponse(
              deleteNotification.filePath,
              true,
              deleteNotification.deleteRequestId
            )
          }
          className={`px-4 py-2 rounded ${
            theme === "dark"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-green-500 hover:bg-green-600"
          } text-white`}
        >
          Approve
        </button>
        <button
          onClick={() =>
            handleDeleteResponse(
              deleteNotification.filePath,
              false,
              deleteNotification.deleteRequestId
            )
          }
          className={`px-4 py-2 rounded ${
            theme === "dark"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-500 hover:bg-red-600"
          } text-white`}
        >
          Reject
        </button>
      </div>
    </div>
  </div>
)}

        </div>

        <div
          className={`w-64 border-l ${
            theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <div className="h-full flex flex-col">
            <UserList users={users} theme={theme} currentUser={alias} />
            <Chat
              messages={messages}
              onSendMessage={handleSendMessage}
              theme={theme}
              currentUser={alias}
              inputClassName={`${
                theme === "dark"
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingRoom;