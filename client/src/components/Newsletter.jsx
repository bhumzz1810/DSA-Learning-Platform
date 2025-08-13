// client/src/components/Newsletter.jsx
import { useState } from "react";
const RAW = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  ""
);
const API = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNote(null);
    try {
      const r = await fetch(`${API}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message || "Failed");
      setNote({
        ok: true,
        text: data.message || "Check your email to confirm.",
      });
      setEmail("");
    } catch (e) {
      setNote({ ok: false, text: "Could not subscribe. Try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full p-3 rounded-lg border border-[#2d2d3a] bg-white/5 text-white"
      />
      <button
        disabled={busy}
        className="px-6 py-3 rounded-lg bg-cyan-500 text-white"
      >
        {busy ? "Subscribing…" : "Subscribe"}
      </button>
      {note && (
        <p className={`text-sm ${note.ok ? "text-green-400" : "text-red-400"}`}>
          {note.text}
        </p>
      )}
    </form>
  );
}
