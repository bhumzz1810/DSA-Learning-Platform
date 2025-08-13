// src/components/DefaultAvatar.jsx
import React, { useState } from "react";

const PALETTES = [
  ["#6366f1", "#22d3ee"], // indigo -> cyan
  ["#06b6d4", "#3b82f6"], // cyan -> blue
  ["#8b5cf6", "#ec4899"], // violet -> pink
  ["#16a34a", "#22c55e"], // green
  ["#f97316", "#f59e0b"], // orange -> amber
];

function hashCode(s = "") {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function pickPalette(seed) {
  return PALETTES[seed % PALETTES.length];
}

function getInitials(name = "") {
  const trimmed = (name || "").trim();
  if (!trimmed) return "DS";
  const parts = trimmed.replace(/\s+/g, " ").split(" ");
  const first = (parts[0] || "").charAt(0);
  const second = (parts[1] || "").charAt(0);
  const initials = (first + (second || "")).toUpperCase();
  return initials || "DS";
}

export default function DefaultAvatar({
  name = "DSArena User",
  src, // optional: user.photoUrl
  size = 40,
  rounded = true,
  className = "",
}) {
  const [loadError, setLoadError] = useState(false);
  const seed = hashCode(name.toLowerCase());
  const [from, to] = pickPalette(seed);
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.42);

  if (src && !loadError) {
    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        className={`${
          rounded ? "rounded-full" : "rounded-lg"
        } object-cover ${className}`}
        onError={() => setLoadError(true)}
      />
    );
  }

  return (
    <div
      aria-label={name}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
      className={`relative flex items-center justify-center text-white font-semibold select-none ${
        rounded ? "rounded-full" : "rounded-lg"
      } ${className}`}
    >
      <span style={{ fontSize }}>{initials}</span>

      {/* subtle code glyph overlay */}
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="absolute inset-0"
        style={{ opacity: 0.12 }}
        fill="none"
        stroke="currentColor"
      >
        <path d="M8 9l-3 3 3 3M16 9l3 3-3 3M14 4l-4 16" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
