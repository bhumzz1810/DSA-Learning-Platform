// client/src/pages/BillingSuccess.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export default function BillingSuccess() {
  const { search } = useLocation();
  const navigate = useNavigate();
  const sessionId = new URLSearchParams(search).get("session_id");
  const [status, setStatus] = useState("verifying"); // verifying | activating | active | failed
  const token = localStorage.getItem("token");

  useEffect(() => {
    // 1) (Optional) verify the Checkout session belongs to this user
    const verifySession = async () => {
      try {
        await fetch(
          `${API}/api/stripe/session?id=${encodeURIComponent(sessionId)}`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          }
        );
        setStatus("activating");
      } catch {
        setStatus("failed");
      }
    };

    // 2) Poll your API until webhook marks user subscribed
    const waitForSubscription = async () => {
      const deadline = Date.now() + 30_000; // 30s max
      while (Date.now() < deadline) {
        try {
          const res = await fetch(`${API}/api/auth/status`, {
            headers: { Authorization: token ? `Bearer ${token}` : "" },
          });
          const data = await res.json();
          if (data.subscriptionActive) {
            setStatus("active");
            // optional: store any user object if your API returns it
            setTimeout(() => {
              navigate("/dashboard"); // or "/join-room"
            }, 1000);
            return;
          }
          await new Promise((r) => setTimeout(r, 1500));
        } catch {
          await new Promise((r) => setTimeout(r, 1500));
        }
      }
      setStatus("failed"); // timed out
    };

    if (sessionId) {
      verifySession().then(waitForSubscription);
    } else {
      setStatus("failed");
    }
  }, [sessionId, navigate, token]);

  const openPortal = async () => {
    const res = await fetch(`${API}/stripe/portal`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    const { url } = await res.json();
    window.location.assign(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-center">
      {status === "verifying" && <p>Verifying your payment…</p>}
      {status === "activating" && <p>Activating your subscription…</p>}
      {status === "active" && (
        <div>
          <h1 className="text-2xl font-semibold mb-2">
            🎉 Payment successful!
          </h1>
          <p className="mb-6">You’ll be redirected in a moment.</p>
          <button
            onClick={openPortal}
            className="px-4 py-2 rounded bg-blue-600 text-white"
          >
            Manage billing
          </button>
        </div>
      )}
      {status === "failed" && (
        <div>
          <h1 className="text-xl font-semibold mb-2">
            We’re still confirming your payment
          </h1>
          <p className="mb-4">
            If this persists, refresh this page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded bg-gray-200"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
