import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Badge = ({ children, tone = "slate" }) => {
  const tones = {
    slate:
      "bg-slate-100 text-slate-700 dark:bg-slate-800/70 dark:text-slate-200",
    green:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
    red: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
    amber:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
    violet:
      "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
        tones[tone] || tones.slate
      }`}
    >
      {children}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="p-3">
      <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
    <td className="p-3">
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
    <td className="p-3">
      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </td>
    <td className="p-3">
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
  </tr>
);

const ProblemList = () => {
  const API = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
    /\/+$/,
    ""
  );
  const [problems, setProblems] = useState([]);
  const [showArchived, setShowArchived] = useState(false);

  // table state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // filters
  const [q, setQ] = useState("");
  const [difficulty, setDifficulty] = useState(""); // "Easy|Medium|Hard" (your DB)
  const [sortBy, setSortBy] = useState("createdAt"); // "createdAt" | "title" | "category" | "difficulty"
  const [order, setOrder] = useState("desc");

  // ui
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const searchTimer = useRef(null);

  useEffect(() => {
    fetchProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showArchived, page, limit, q, difficulty, sortBy, order]);

  const fetchProblems = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const token = localStorage.getItem("token");
      const params = {
        page,
        limit,
        archived: showArchived ? "true" : "false",
        sortBy,
        order,
      };
      if (q) params.q = q;
      if (difficulty) params.difficulty = difficulty; // matches current DB values

      const { data } = await axios.get(`${API}/api/problems/admin`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setProblems(Array.isArray(data?.items) ? data.items : []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    } catch (err) {
      console.error("Failed to fetch problems:", err);
      setErrMsg("Could not load problems. Please try again.");
      setProblems([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Archive this problem?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API}/api/problems/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // optimistic update
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Archive failed:", err);
      alert("Archiving failed.");
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API}/api/problems/${id}/restore`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProblems((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Restore failed:", err);
      alert("Restore failed.");
    }
  };

  const pretty = (d) => (d ? d[0].toUpperCase() + d.slice(1) : "—");

  // header cells with sort toggles
  const SortHeader = ({ label, field }) => {
    const active = sortBy === field;
    const nextOrder = active && order === "asc" ? "desc" : "asc";
    return (
      <th className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 text-left p-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
        <button
          className={`inline-flex items-center gap-1 ${
            active ? "text-slate-900 dark:text-slate-100" : ""
          }`}
          onClick={() => {
            setSortBy(field);
            setOrder(nextOrder);
            setPage(1);
          }}
          title={`Sort by ${label}`}
        >
          <span>{label}</span>
          <svg
            className={`h-3 w-3 transition-transform ${
              active ? (order === "asc" ? "rotate-180" : "") : "opacity-40"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 12l-4-4h8l-4 4z" />
          </svg>
        </button>
      </th>
    );
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* Title + Controls */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {showArchived ? "Archived Problems" : "All Problems"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading ? "Loading…" : `${total} item${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search title / slug / category…"
              className="w-64 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              onChange={(e) => {
                const v = e.target.value;
                if (searchTimer.current) clearTimeout(searchTimer.current);
                searchTimer.current = setTimeout(() => {
                  setQ(v);
                  setPage(1);
                }, 350);
              }}
            />
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 18a8 8 0 115.292-14.292l4.5 4.5-1.414 1.414-4.5-4.5A6 6 0 1010 16a6 6 0 004.472-2.08l1.516 1.316A8 8 0 0110 18z" />
              </svg>
            </div>
          </div>

          {/* Difficulty */}
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={difficulty}
            onChange={(e) => {
              setDifficulty(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Sort field */}
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="createdAt">Newest</option>
            <option value="title">Title</option>
            <option value="category">Category</option>
            <option value="difficulty">Difficulty</option>
          </select>

          {/* Sort order */}
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(1);
            }}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>

          {/* Archived toggle */}
          <button
            onClick={() => {
              setShowArchived((v) => !v);
              setPage(1);
            }}
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {showArchived ? "← Back to Active" : "View Archived"}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <SortHeader label="Title" field="title" />
                <SortHeader label="Category" field="category" />
                <SortHeader label="Difficulty" field="difficulty" />
                <th className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-800 text-left p-3 text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading && (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              )}

              {!loading &&
                problems.length > 0 &&
                problems.map((problem) => (
                  <tr
                    key={problem._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                      {problem.title}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {problem.category || "—"}
                    </td>
                    <td className="p-3">
                      <Badge
                        tone={
                          (problem.difficulty || "").toLowerCase() === "easy"
                            ? "green"
                            : (problem.difficulty || "").toLowerCase() ===
                              "medium"
                            ? "amber"
                            : "red"
                        }
                      >
                        {pretty(problem.difficulty)}
                      </Badge>
                    </td>
                    <td className="p-3">
                      {showArchived ? (
                        <button
                          onClick={() => handleRestore(problem._id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-emerald-700 active:bg-emerald-800"
                        >
                          Restore
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Link
                            to={`/admin/problems/edit/${problem._id}`}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-700 active:bg-blue-800"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(problem._id)}
                            className="inline-flex items-center gap-1 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 active:bg-rose-800"
                          >
                            Archive
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}

              {!loading && problems.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-10">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="mb-3 rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                        <svg
                          className="h-6 w-6"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M3 5h18v2H3V5zm0 6h12v2H3v-2zm0 6h18v2H3v-2z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        No problems found
                      </h3>
                      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between gap-2 border-t border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="text-slate-600 dark:text-slate-300">
            Page <span className="font-medium">{page}</span>
            {totalPages ? (
              <>
                {" "}
                of <span className="font-medium">{totalPages}</span>
              </>
            ) : null}{" "}
            • <span className="font-medium">{total}</span> total
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm disabled:opacity-40 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={totalPages && page >= totalPages}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 shadow-sm disabled:opacity-40 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Error toast-ish */}
      {errMsg && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          {errMsg}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
