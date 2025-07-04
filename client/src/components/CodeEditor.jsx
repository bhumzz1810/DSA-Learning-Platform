import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ code, onChange, language, theme }) => {
  const [editorTheme, setEditorTheme] = useState("vs");

  useEffect(() => {
    // Map our theme names to Monaco editor themes
    const themeMap = {
      light: "vs",
      dark: "vs-dark",
      ocean: "vs",
      forest: "vs",
    };
    setEditorTheme(themeMap[theme] || "vs");
  }, [theme]);

  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language={language}
        theme={editorTheme}
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          wordWrap: "on",
          automaticLayout: true,
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditor;
