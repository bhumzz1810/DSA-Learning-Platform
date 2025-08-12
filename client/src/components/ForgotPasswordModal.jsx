import { useState } from "react";

export default function ForgotPasswordModal({ open, onClose, apiBase }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const REST = apiBase.replace(/\/+$/, "");

  if (!open) return null;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await fetch(`${REST}/api/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setDone(true); // always OK (don’t leak users)
    } catch (e) {
      setDone(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Reset your password</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {done ? (
          <div className="text-sm text-gray-700 space-y-3">
            <p>If that email exists, we’ve sent a reset link.</p>
            <p className="text-gray-500">
              Check your Mailtrap inbox (dev) or your email (prod).
            </p>
            <button
              onClick={onClose}
              className="mt-2 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 outline-none text-slate-900 focus:ring-2 focus:ring-blue-300"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={busy}
              className={`w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-white ${
                busy ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {busy ? "Sending…" : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
