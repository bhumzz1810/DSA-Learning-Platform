import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { socket, connectSocket, disconnectSocket } from "../socket";
import CodeEditor from "../components/CodeEditor";
import FileExplorer from "../components/FileExplorer";
import UserList from "../components/UserList";
import Chat from "../components/Chat";
import { useTheme } from "../components/ThemeContext";

const CodingRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  // State management
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [roomId, setRoomId] = useState(null);
  const [alias, setAlias] = useState(null);

  const fileInputRef = useRef(null);
  const activeFileRef = useRef(activeFile);

  // Update ref when activeFile changes
  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  // Define all handler functions at the top
  const handleExitSession = () => {
    if (socket.connected) {
      socket.emit("leave-room", { roomId });
      disconnectSocket();
    }
    navigate("/join-room");
  };

  const handleFileSelect = (file) => {
    if (file.isDirectory) return;

    setActiveFile(file);
    if (socket.connected) {
      socket.emit("request-file", { filePath: file.path });
    }
  };

  const handleCodeChange = (newCode) => {
    setCode(newCode);
    if (socket.connected && activeFileRef.current) {
      socket.emit("code-change", {
        filePath: activeFileRef.current.path,
        newCode,
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

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    if (uploadedFiles.length === 0) return;

    setIsLoading(true);
    try {
      const newFiles = await Promise.all(
        uploadedFiles.map(async (file) => {
          const content = await readFileContent(file);
          return {
            name: file.name,
            path: `/${file.name}`,
            type: file.type,
            content,
            isDirectory: false,
            lastModified: file.lastModified,
          };
        })
      );

      setFiles((prev) => [...prev, ...newFiles]);

      if (socket.connected && roomId) {
        socket.emit("files-added", {
          roomId,
          files: newFiles.map(({ name, path, type, isDirectory }) => ({
            name,
            path,
            type,
            isDirectory,
          })),
        });
      }

      if (newFiles.length > 0) {
        handleFileSelect(newFiles[0]);
      }
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsLoading(false);
      event.target.value = "";
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

  const handleSaveFile = () => {
    if (!activeFile) return;

    if (socket.connected) {
      socket.emit("save-file", {
        filePath: activeFile.path,
        content: code,
      });
      alert("File saved successfully!");
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

    if (socket.connected && roomId) {
      socket.emit("files-added", {
        roomId,
        files: [
          {
            name: newFile.name,
            path: newFile.path,
            type: newFile.type,
            isDirectory: false,
          },
        ],
      });
    }
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
  };

  // Socket connection and event handlers
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

    const onConnect = () => setConnectionStatus("connected");
    const onDisconnect = () => setConnectionStatus("disconnected");
    const onConnectError = () => setConnectionStatus("error");

    const onUsersUpdated = (updatedUsers) => {
      const activeUsers = updatedUsers.filter((user) => user.isActive);
      setUsers(activeUsers);

      if (activeUsers.length === 0) {
        clearRoomData();
      }
    };

    const onFilesUpdated = (updatedFiles) => {
      setFiles(updatedFiles);
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

      if (socket.connected) {
        socket.emit("leave-room", { roomId: room });
        disconnectSocket();
      }
    };
  }, [location, navigate]);

  return (
    <div
      className={`flex flex-col h-screen ${
        theme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-gray-100 text-gray-900"
      }`}
    >
      <header
        className={`p-4 flex justify-between items-center border-b ${
          theme === "dark"
            ? "border-gray-700 bg-gray-800"
            : "border-gray-200 bg-white"
        }`}
      >
        <div>
          <h1 className="text-xl font-bold">Pair Coding</h1>
          <div className="flex items-center space-x-4">
            <p className="text-sm">
              Status:{" "}
              <span
                className={
                  connectionStatus === "connected"
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {connectionStatus.toUpperCase()}
              </span>
            </p>
            {roomId && <p className="text-sm">Room: {roomId}</p>}
            <p className="text-sm">
              Users Online:{" "}
              <span className="font-semibold">{users.length}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {/* Theme selector dropdown */}
          <div className="relative group">
            <button
              className={`px-3 py-1 rounded-md ${
                theme === "dark"
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Theme
            </button>
            <div
              className={`absolute right-0 mt-2 w-32 rounded-md shadow-lg py-1 z-10 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } hidden group-hover:block`}
            >
              <button
                onClick={() => toggleTheme("light")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Light
              </button>
              <button
                onClick={() => toggleTheme("dark")}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Dark
              </button>
            </div>
          </div>

          {/* Exit button */}
          <button
            onClick={handleExitSession}
            className={`px-4 py-2 rounded transition-colors ${
              theme === "dark"
                ? "bg-red-700 hover:bg-red-600"
                : "bg-red-600 hover:bg-red-500"
            } text-white`}
          >
            Exit Session
          </button>

          {/* File actions */}
          <div className="flex space-x-2">
            <button
              onClick={handleNewFile}
              className={`px-4 py-2 rounded transition-colors ${
                theme === "dark"
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-indigo-500 hover:bg-indigo-600"
              } text-white`}
            >
              New File
            </button>
            <button
              onClick={handleSaveFile}
              disabled={!activeFile || isLoading}
              className={`px-4 py-2 rounded transition-colors ${
                !activeFile || isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-green-500 hover:bg-green-600"
              } text-white`}
            >
              {isLoading ? "Saving..." : "Save File"}
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
            <label
              className={`cursor-pointer px-4 py-2 rounded transition-colors ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : theme === "dark"
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-purple-500 hover:bg-purple-600"
              } text-white`}
            >
              {isLoading ? "Uploading..." : "Upload Files"}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                multiple
                onChange={handleFileUpload}
                disabled={isLoading}
              />
            </label>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - File explorer */}
        <div
          className={`w-64 border-r ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
          }`}
        >
          <FileExplorer
            files={files}
            onFileSelect={handleFileSelect}
            activeFile={activeFile}
            theme={theme}
          />
        </div>

        {/* Main content - Code editor */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeFile ? (
            <CodeEditor
              code={code}
              onChange={handleCodeChange}
              language={language}
              theme={theme}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">Select a file to start coding</p>
            </div>
          )}
        </div>

        {/* Right sidebar - Users and chat */}
        <div
          className={`w-64 border-l ${
            theme === "dark"
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-white"
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
