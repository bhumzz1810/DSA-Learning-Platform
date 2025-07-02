import { useState } from "react";

const FileExplorer = ({ files, onFileSelect, activeFile, theme }) => {
  const [expandedFolders, setExpandedFolders] = useState({});

  const toggleFolder = (path) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Keyboard support for folders and files
  const handleKeyDown = (e, onClick) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  const renderFiles = (files, path = "", depth = 0) => {
    return files.map((file) => {
      const fullPath = path ? `${path}/${file.name}` : `/${file.name}`;

      if (file.isDirectory) {
        const isExpanded = expandedFolders[fullPath];
        return (
          <div key={fullPath} role="treeitem" aria-expanded={isExpanded ? "true" : "false"}>
            <div
              tabIndex={0}
              onClick={() => toggleFolder(fullPath)}
              onKeyDown={(e) => handleKeyDown(e, () => toggleFolder(fullPath))}
              className={`flex items-center cursor-pointer rounded py-1 px-2 select-none ${
                theme === "dark"
                  ? "hover:bg-gray-700 text-gray-300"
                  : "hover:bg-gray-200 text-gray-800"
              }`}
              style={{ paddingLeft: `${depth * 1.25}rem` }}
            >
              <span className="mr-2">{isExpanded ? "📂" : "📁"}</span>
              <span>{file.name}</span>
            </div>
            {isExpanded && (
              <div role="group" className="transition-all duration-200 ease-in-out">
                {renderFiles(file.children || [], fullPath, depth + 1)}
              </div>
            )}
          </div>
        );
      } else {
        const isActive = activeFile?.path === fullPath;
        return (
          <div
            key={fullPath}
            role="treeitem"
            tabIndex={0}
            onClick={() => onFileSelect({ ...file, path: fullPath })}
            onKeyDown={(e) => handleKeyDown(e, () => onFileSelect({ ...file, path: fullPath }))}
            className={`flex items-center cursor-pointer rounded py-1 px-2 select-none ${
              isActive
                ? theme === "dark"
                  ? "bg-blue-900 text-white"
                  : "bg-blue-200 text-gray-900"
                : theme === "dark"
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-200 text-gray-800"
            }`}
            style={{ paddingLeft: `${depth * 1.25}rem` }}
          >
            <span className="mr-2">📄</span>
            <span>{file.name}</span>
          </div>
        );
      }
    });
  };

  return (
    <div
      role="tree"
      className={`h-full overflow-y-auto p-2 select-none ${
        theme === "dark" ? "bg-gray-900 text-gray-300" : "bg-white text-gray-800"
      }`}
    >
      <div className="font-semibold mb-2">Files</div>
      {files.length > 0 ? (
        renderFiles(files)
      ) : (
        <p className="text-sm italic select-text">No files available</p>
      )}
    </div>
  );
};

export default FileExplorer;
