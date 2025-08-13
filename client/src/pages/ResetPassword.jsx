import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const REST = API.replace(/\/+$/, "");

  // Robust token parsing for HashRouter
  const token = useMemo(() => {
    const hash = window.location.hash || "";
    const q = hash.includes("?") ? hash.split("?")[1] : "";
    const params = new URLSearchParams(q);
    return params.get("token") || "";
  }, []);

  useEffect(() => {
    if (!token) setError("Missing or invalid reset link.");
  }, [token]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6)
      return setError("Password must be at least 6 chars.");
    if (password !== confirm) return setError("Passwords do not match.");

    setBusy(true);
    try {
      const res = await fetch(`${REST}/api/auth/reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not reset password");
      }
      alert("Password updated! Please log in.");
      navigate("/login");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative z-10">
      <div className="w-full max-w-md bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Set a new password</h1>

        {error && (
          <div className="mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded p-2">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4" autoComplete="off">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="npw">
              New password
            </label>
            <input
              id="npw"
              name="new-password"
              type="password"
              autoComplete="new-password"
              autoFocus
              className="w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 text-slate-900 focus:ring-blue-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="cpw">
              Confirm password
            </label>
            <input
              id="cpw"
              name="confirm-password"
              type="password"
              autoComplete="new-password"
              className="w-full border rounded-lg px-3 py-2 outline-none text-slate-900 focus:ring-2 focus:ring-blue-300"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={busy || !token}
            className={`w-full rounded-lg text-white py-2 ${
              busy ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {busy ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
