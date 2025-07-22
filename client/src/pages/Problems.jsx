import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import axios from "axios";

const BackgroundGradient = ({
  children,
  className,
  containerClassName,
  animate = true,
}) => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: { backgroundPosition: ["0 50%", "100% 50%", "0 50%"] },
  };

  return (
    <div className={cn("relative p-[2px] group", containerClassName)}>
      <motion.div
        variants={animate ? variants : undefined}
        initial="initial"
        animate="animate"
        transition={
          animate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-xl z-[1] opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      <motion.div
        variants={animate ? variants : undefined}
        initial="initial"
        animate="animate"
        transition={
          animate
            ? { duration: 5, repeat: Infinity, repeatType: "reverse" }
            : undefined
        }
        style={{ backgroundSize: animate ? "400% 400%" : undefined }}
        className={cn(
          "absolute inset-0 rounded-xl z-[1] will-change-transform",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const problemsPerPage = 9;
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [dailyOnly, setDailyOnly] = useState(false);
  const navigate = useNavigate(); // inside your component
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000/api"
          }/problems`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProblems(res.data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };
    const fetchBookmarks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return; // ✅ Don't fetch if not logged in

      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000/api"
          }/bookmarks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const ids = res.data.bookmarks.map((p) => p._id);
        setBookmarkedIds(ids);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };

    fetchBookmarks();
    fetchProblems();
  }, []);

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty =
      difficultyFilter === "All" || problem.difficulty === difficultyFilter;
    const matchesSearch =
      problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (problem.category || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesDaily = !dailyOnly || problem.isDaily;

    return matchesDifficulty && matchesSearch && matchesDaily;
  });

  const totalPages = Math.ceil(filteredProblems.length / problemsPerPage);
  const indexOfLastProblem = currentPage * problemsPerPage;
  const indexOfFirstProblem = indexOfLastProblem - problemsPerPage;
  const currentProblems = filteredProblems.slice(
    indexOfFirstProblem,
    indexOfLastProblem
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to toggle bookmark
  const toggleBookmark = async (problemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLoginPrompt(true);
      return;
    }
    try {
      if (bookmarkedIds.includes(problemId)) {
        await axios.delete(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000/api"
          }/bookmarks/${problemId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarkedIds(bookmarkedIds.filter((id) => id !== problemId));
      } else {
        await axios.post(
          `${
            import.meta.env.VITE_API_URL || "http://localhost:5000/api"
          }/bookmarks/${problemId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBookmarkedIds([...bookmarkedIds, problemId]);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            DSArena Challenges
          </h1>
          <div className="flex flex-wrap md:flex-nowrap gap-4 w-full md:justify-end items-center">
            {/* 🔍 Search bar */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search problems..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 pr-10 bg-white text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* 🎯 Difficulty dropdown */}
            <select
              value={difficultyFilter}
              onChange={(e) => {
                setDifficultyFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none px-4 py-2 bg-white text-gray-900 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all w-full md:w-48"
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* 🔥 Daily Challenge checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="dailyOnly"
                type="checkbox"
                checked={dailyOnly}
                onChange={() => setDailyOnly(!dailyOnly)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="dailyOnly" className="text-sm text-gray-700">
                Show only Daily Challenge
              </label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProblems.length > 0 ? (
            currentProblems.map((problem) => (
              <motion.div
                key={problem._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BackgroundGradient
                  containerClassName={cn(
                    "rounded-xl shadow-md transition-transform duration-300",
                    problem.isDaily
                      ? "ring-2 ring-blue-400 hover:scale-[1.03] animate-pulse"
                      : "hover:scale-[1.02]"
                  )}
                >
                  <div
                    className={cn(
                      "bg-white rounded-xl p-5 flex flex-col h-full",
                      problem.isDaily &&
                        "border border-blue-500 shadow-md shadow-blue-200 animate-pulse"
                    )}
                  >
                    <div className="bg-white rounded-xl p-5 flex flex-col h-full">
                      {/* Row 1: Title + Bookmark */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex flex-col">
                          <h2 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                            {problem.title}
                          </h2>
                          {problem.isDaily && (
                            <span className="mt-1 inline-block text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full w-fit">
                              🔥 Daily Challenge
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleBookmark(problem._id)}
                          className="text-gray-400 hover:text-yellow-500 transition"
                          aria-label="Bookmark problem"
                        >
                          {bookmarkedIds.includes(problem._id) ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                              className="w-5 h-5"
                            >
                              <path d="M6 4a2 2 0 012-2h8a2 2 0 012 2v18l-7-4-7 4V4z" />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-4-7 4V5z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>

                      {/* Row 2: Category + Difficulty */}
                      <div className="flex items-center justify-between mb-5">
                        <p className="text-sm text-gray-600">
                          Category:{" "}
                          <span className="font-medium">
                            {problem.category || "N/A"}
                          </span>
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : problem.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {problem.difficulty}
                        </span>
                      </div>

                      {/* Row 3: Solve Button */}
                      <div className="mt-auto">
                        <Link
                          to={`/problems/${problem._id}`}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          Solve Challenge
                        </Link>
                      </div>
                    </div>
                  </div>
                </BackgroundGradient>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <div className="bg-gray-50 p-8 rounded-xl max-w-md mx-auto">
                <svg
                  className="w-12 h-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-xl font-medium text-gray-700">
                  No problems found
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-l-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`px-4 py-2 border-t border-b border-gray-300 transition-colors ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-r-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        )}

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
