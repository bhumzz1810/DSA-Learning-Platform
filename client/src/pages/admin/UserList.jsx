import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const Badge = ({ tone = "slate", children }) => {
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
      className={`px-2 py-0.5 rounded-full text-xs font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
};

const SkeletonRow = () => (
  <tr className="animate-pulse">
    <td className="p-3">
      <div className="h-4 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
    <td className="p-3">
      <div className="h-4 w-36 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
    <td className="p-3">
      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </td>
    <td className="p-3">
      <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </td>
    <td className="p-3">
      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
    <td className="p-3">
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
    <td className="p-3">
      <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
    </td>
  </tr>
);

export default function UserList() {
  const API_ROOT = (
    import.meta.env.VITE_API_URL ||
    "https://dsa-learning-platform-five.vercel.app"
  ).replace(/\/+$/, "");
  const API = `${API_ROOT}/api`;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  // filters/sort/pager
  const [q, setQ] = useState("");
  const [role, setRole] = useState(""); // "" | "user" | "admin"
  const [subscribed, setSubscribed] = useState(""); // "" | "true" | "false"
  const [sortBy, setSortBy] = useState("createdAt"); // createdAt | username | email | lastLogin
  const [order, setOrder] = useState("desc"); // asc | desc
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const searchTimer = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const token = localStorage.getItem("token");
      const params = { page, limit, sortBy, order };
      if (q) params.q = q;
      if (role) params.role = role;
      if (subscribed) params.subscribed = subscribed;

      const { data } = await axios.get(`${API}/user/admin`, {
        params,
        headers: { Authorization: `Bearer ${token}` },
      });

      setRows(Array.isArray(data?.items) ? data.items : []);
      setTotal(data?.total ?? 0);
      setTotalPages(data?.totalPages ?? 0);
    } catch (e) {
      console.error(e);
      setErrMsg("Failed to load users.");
      setRows([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(); /* eslint-disable-next-line */
  }, [q, role, subscribed, sortBy, order, page, limit]);

  const toggleRole = async (u) => {
    const token = localStorage.getItem("token");
    const newRole = u.role === "admin" ? "user" : "admin";
    // optimistic
    setRows((prev) =>
      prev.map((r) => (r._id === u._id ? { ...r, role: newRole } : r))
    );
    try {
      await axios.patch(
        `${API}/user/${u._id}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (e) {
      // rollback on error
      setRows((prev) =>
        prev.map((r) => (r._id === u._id ? { ...r, role: u.role } : r))
      );
      alert("Role update failed");
    }
  };

  const SortHeader = ({ field, label }) => {
    const active = sortBy === field;
    const next = active && order === "asc" ? "desc" : "asc";
    return (
      <th className="sticky top-0 bg-slate-50 dark:bg-slate-800 p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
        <button
          className={`inline-flex items-center gap-1 ${
            active ? "text-slate-900 dark:text-slate-100" : ""
          }`}
          onClick={() => {
            setSortBy(field);
            setOrder(next);
            setPage(1);
          }}
        >
          <span>{label}</span>
          <svg
            className={`h-3 w-3 ${
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
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Users
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {loading ? "Loading…" : `${total} total`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search email / username…"
            className="w-72 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onChange={(e) => {
              const v = e.target.value;
              if (searchTimer.current) clearTimeout(searchTimer.current);
              searchTimer.current = setTimeout(() => {
                setQ(v);
                setPage(1);
              }, 300);
            }}
          />
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={subscribed}
            onChange={(e) => {
              setSubscribed(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All subs</option>
            <option value="true">Subscribed</option>
            <option value="false">Not subscribed</option>
          </select>
          <select
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
          >
            <option value="createdAt">Newest</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
            <option value="lastLogin">Last Login</option>
          </select>
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
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-800">
        <div className="max-h-[70vh] overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <SortHeader field="username" label="Username" />
                <SortHeader field="email" label="Email" />
                <th className="sticky top-0 bg-slate-50 dark:bg-slate-800 p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Role
                </th>
                <th className="sticky top-0 bg-slate-50 dark:bg-slate-800 p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
                  Subscribed
                </th>
                <SortHeader field="lastLogin" label="Last Login" />
                <SortHeader field="createdAt" label="Joined" />
                <th className="sticky top-0 bg-slate-50 dark:bg-slate-800 p-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">
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
                rows.length > 0 &&
                rows.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-100">
                      {u.username || "—"}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {u.email}
                    </td>
                    <td className="p-3">
                      <Badge tone={u.role === "admin" ? "violet" : "slate"}>
                        {u.role}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Badge tone={u.subscribed ? "green" : "red"}>
                        {u.subscribed ? "Active" : "None"}
                      </Badge>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {u.lastLogin
                        ? new Date(u.lastLogin).toLocaleString()
                        : "—"}
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => toggleRole(u)}
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-700 active:bg-blue-800"
                        title={
                          u.role === "admin"
                            ? "Demote to user"
                            : "Promote to admin"
                        }
                      >
                        {u.role === "admin" ? "Demote" : "Promote"}
                      </button>
                    </td>
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10">
                    <div className="text-center text-slate-600 dark:text-slate-300">
                      No users found.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
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

      {errMsg && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200">
          {errMsg}
        </div>
      )}
    </div>
  );
}
