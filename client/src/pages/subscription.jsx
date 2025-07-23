import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const user = JSON.parse(localStorage.getItem("user"));

const SubscriptionPage = () => {
  const location = useLocation();
  const billing = location.state?.billing || "monthly"; // fallback to monthly

  const handleSubscribe = async () => {
    console.log("User for subscription:", user, "Billing:", billing);

    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        email: user.email,
        billing, // ✅ Pass billing type to backend
      }),
    });

    const data = await res.json();
    window.location.href = data.url;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Subscription Page</h1>
      <p className="text-lg mb-2 text-gray-700">
        You selected the{" "}
        <strong className="text-blue-600 capitalize">{billing}</strong> plan.
      </p>
      <p className="text-lg mb-6 text-gray-600">
        Subscribe to our premium plan for exclusive features!
      </p>
      <button
        onClick={handleSubscribe}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Subscribe Now
      </button>
    </div>
  );
}
