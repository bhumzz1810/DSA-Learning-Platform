import React from "react";

const SubscriptionPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Subscription Page</h1>
      <p className="text-lg mb-6">Subscribe to our premium plan for exclusive features!</p>
      <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
        Subscribe Now
      </button>
    </div>
  );
}

export default SubscriptionPage;
