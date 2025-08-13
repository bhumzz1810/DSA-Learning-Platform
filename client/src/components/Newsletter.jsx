import React, { useState } from "react";

// Build a robust API base whether VITE_API_URL includes /api or not
const RAW = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  ""
);
const API = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null); // { ok: boolean, text: string }
  const [website, setWebsite] = useState(""); // honeypot

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setNote(null);

    try {
      const res = await fetch(`${API}/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok)
        throw new Error(data.message || "Subscribe failed");
      setNote({
        ok: true,
        text: data.message || "Check your email to confirm your subscription.",
      });
      setEmail("");
      setWebsite("");
    } catch (err) {
      setNote({ ok: false, text: "Could not subscribe. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="bg-black text-white py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
        <p className="text-gray-400 mb-8">
          Subscribe to our newsletter for the latest updates, coding tips, and
          exclusive platform news.
        </p>

        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          {/* Honeypot (hidden) — bots will fill this; server ignores such requests */}
          <input
            type="text"
            name="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
          />

          <input
            type="email"
            required
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 min-h-8 rounded-full bg-white/5 border border-[#2d2d3a] placeholder-gray-400 focus:outline-none w-full sm:w-auto"
          />
          <button
            type="submit"
            disabled={busy}
            className="min-w-[200px] min-h-8 px-6 py-2 rounded-full text-white bg-white/10 border border-gray-300/40 hover:bg-white/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {busy ? "Subscribing…" : "Subscribe"}
          </button>
        </form>

        {note && (
          <p
            className={`mt-4 text-sm ${
              note.ok ? "text-green-400" : "text-red-400"
            }`}
          >
            {note.text}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
