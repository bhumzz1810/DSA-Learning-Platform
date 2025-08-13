// src/pages/admin/EditProblem.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_ROOT = (
  import.meta.env.VITE_API_URL ||
  "https://dsa-learning-platform-five.vercel.app"
).replace(/\/+$/, "");
const API = `${API_ROOT}/api`;

const isImageUrl = (url = "") => /\.(gif|png|jpe?g|svg|webp)$/i.test(url);
const toEmbedUrl = (url = "") => {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com") && u.pathname === "/watch") {
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : url;
    }
    return url;
  } catch {
    return url;
  }
};

export default function EditProblem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [problem, setProblem] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ---------- fetch
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(`${API}/problems/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // ensure arrays exist
        data.testCases =
          Array.isArray(data.testCases) && data.testCases.length
            ? data.testCases
            : [{ input: "", expectedOutput: "" }];
        data.hints =
          Array.isArray(data.hints) && data.hints.length ? data.hints : [""];
        setProblem(data);
      } catch (err) {
        toast.error("Failed to load problem");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  // ---------- helpers
  const onField = (e) =>
    setProblem((p) => ({ ...p, [e.target.name]: e.target.value }));

  const setTestCase = (i, k, v) =>
    setProblem((p) => {
      const arr = p.testCases.slice();
      arr[i] = { ...arr[i], [k]: v };
      return { ...p, testCases: arr };
    });

  const addTestCase = () =>
    setProblem((p) => ({
      ...p,
      testCases: [...p.testCases, { input: "", expectedOutput: "" }],
    }));

  const rmTestCase = (i) =>
    setProblem((p) => ({
      ...p,
      testCases: p.testCases.filter((_, idx) => idx !== i),
    }));

  const setHint = (i, v) =>
    setProblem((p) => {
      const arr = p.hints.slice();
      arr[i] = v;
      return { ...p, hints: arr };
    });

  const addHint = () => setProblem((p) => ({ ...p, hints: [...p.hints, ""] }));
  const rmHint = (i) =>
    setProblem((p) => ({ ...p, hints: p.hints.filter((_, idx) => idx !== i) }));

  const validate = () => {
    const e = {};
    if (!problem.title?.trim()) e.title = "Title is required";
    if (!problem.description?.trim()) e.description = "Description is required";
    if (!["Easy", "Medium", "Hard"].includes(problem.difficulty))
      e.difficulty = "Invalid difficulty";
    if (!problem.testCases?.length) e.testCases = "Add at least one test case";
    problem.testCases?.forEach((tc, i) => {
      if (!tc.input?.trim() || !tc.expectedOutput?.trim())
        e[`tc-${i}`] = "Both fields required";
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const preview = useMemo(() => {
    const url = problem?.visualAid?.trim();
    if (!url) return null;
    if (isImageUrl(url)) {
      return (
        <img
          src={url}
          alt="Visual aid"
          className="w-full rounded-lg border border-slate-200 shadow-sm"
          loading="lazy"
        />
      );
    }
    return (
      <div
        className="relative w-full overflow-hidden rounded-lg border border-slate-200 shadow-sm"
        style={{ paddingTop: "56.25%" }}
      >
        <iframe
          src={toEmbedUrl(url)}
          title="Visual Aid"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }, [problem?.visualAid]);

  // ---------- submit
  const save = async (e) => {
    e?.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted fields.");

    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API}/problems/${id}`, problem, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Problem updated ✅");
      navigate("/admin/problems");
    } catch (err) {
      toast.error(err.response?.data?.error || err.message || "Update failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const submitKey = (e) =>
    (e.ctrlKey || e.metaKey) && e.key === "Enter" && save(e);

  if (loading) return <div className="p-10 text-center text-lg">Loading…</div>;
  if (!problem)
    return <div className="p-10 text-center text-lg">Problem not found</div>;

  // ---------- UI
  return (
    <div className="px-4 py-8">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Edit Problem
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Update details, test cases, hints, and the visual aid.
        </p>
      </header>

      <form
        onSubmit={save}
        onKeyDown={submitKey}
        className="flex flex-col xl:flex-row xl:items-start xl:gap-8"
      >
        {/* MAIN COLUMN */}
        <div className="w-full max-w-3xl mx-auto xl:mx-0 flex-1 space-y-6">
          {/* Basics */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold text-slate-800">
              Basics
            </h2>

            <div className="space-y-5">
              <div>
                <span className="block text-sm font-medium text-slate-700">
                  Title
                </span>
                <input
                  name="title"
                  value={problem.title}
                  onChange={onField}
                  placeholder="e.g., Two Sum"
                  className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && (
                  <p className="mt-1 text-xs text-rose-600">{errors.title}</p>
                )}
              </div>

              <div>
                <span className="block text-sm font-medium text-slate-700">
                  Description
                </span>
                <textarea
                  name="description"
                  value={problem.description}
                  onChange={onField}
                  placeholder="Describe the problem, input/output format, examples…"
                  className="mt-1 h-40 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <span className="block text-sm font-medium text-slate-700">
                    Category
                  </span>
                  <input
                    name="category"
                    value={problem.category || ""}
                    onChange={onField}
                    placeholder="e.g., Array, Graph, DP"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-700">
                    Difficulty
                  </span>
                  <select
                    name="difficulty"
                    value={problem.difficulty}
                    onChange={onField}
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div>
                  <span className="block text-sm font-medium text-slate-700">
                    Constraints
                  </span>
                  <input
                    name="constraints"
                    value={problem.constraints || ""}
                    onChange={onField}
                    placeholder="Time/space limits, bounds…"
                    className="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Test cases */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">
                Test Cases
              </h2>
              <button
                type="button"
                onClick={addTestCase}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add test case
              </button>
            </div>

            {problem.testCases.map((tc, i) => (
              <div
                key={i}
                className="mb-4 rounded-xl border border-slate-200 p-3"
              >
                <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                  <span>Case #{i + 1}</span>
                  {problem.testCases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => rmTestCase(i)}
                      className="text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <textarea
                    placeholder="Input"
                    value={tc.input}
                    onChange={(e) => setTestCase(i, "input", e.target.value)}
                    className="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Expected output"
                    value={tc.expectedOutput}
                    onChange={(e) =>
                      setTestCase(i, "expectedOutput", e.target.value)
                    }
                    className="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                {errors[`tc-${i}`] && (
                  <p className="mt-1 text-xs text-rose-600">
                    {errors[`tc-${i}`]}
                  </p>
                )}
              </div>
            ))}
            {errors.testCases && (
              <p className="text-xs text-rose-600">{errors.testCases}</p>
            )}
          </section>

          {/* Hints */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-800">Hints</h2>
              <button
                type="button"
                onClick={addHint}
                className="text-sm text-blue-600 hover:underline"
              >
                + Add hint
              </button>
            </div>
            <div className="space-y-2">
              {problem.hints.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={h}
                    onChange={(e) => setHint(i, e.target.value)}
                    placeholder={`Hint ${i + 1}`}
                    className="flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {problem.hints.length > 1 && (
                    <button
                      type="button"
                      onClick={() => rmHint(i)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* SIDE PANEL */}
        <aside className="w-full xl:w-96 space-y-6 mt-8 xl:mt-0">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-sm font-semibold text-slate-800">
              Visual Aid
            </h2>
            <input
              name="visualAid"
              value={problem.visualAid || ""}
              onChange={onField}
              placeholder="https://example.com/img.png or https://youtu.be/VIDEO"
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="mt-1 text-xs text-slate-500">
              YouTube links auto‑convert for preview.
            </p>
            <div className="mt-3">
              {problem.visualAid?.trim() ? (
                preview
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
                  No visual aid attached
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="submit"
              disabled={saving}
              className={`w-full rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition
                ${
                  saving
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                }`}
              title="Ctrl/⌘ + Enter"
            >
              {saving ? "Saving…" : "Update Problem"}
            </button>
            <p className="mt-2 text-xs text-slate-500">
              Tip: Press <kbd className="rounded bg-slate-200 px-1">Ctrl/⌘</kbd>
              +<kbd className="rounded bg-slate-200 px-1">Enter</kbd> to save.
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
