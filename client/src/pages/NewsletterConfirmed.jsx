// src/pages/NewsletterConfirm.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const RAW = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(
  /\/+$/,
  ""
);
const API = RAW.endsWith("/api") ? RAW : `${RAW}/api`;

export default function NewsletterConfirm() {
  const { search } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = new URLSearchParams(search).get("token");
    if (!token) return;
    fetch(`${API}/newsletter/confirm?token=${encodeURIComponent(token)}`)
      .then(() => navigate("/newsletter/confirmed", { replace: true }))
      .catch(() => navigate("/newsletter/unsubscribed", { replace: true }));
  }, [search, navigate]);
  return <div className="p-8 text-white">Confirming your subscription…</div>;
}
