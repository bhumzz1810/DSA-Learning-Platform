import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaCode,
  FaUserFriends,
  FaBrain,
  FaRocket,
  FaChartLine,
  FaRobot,
  FaEye,
  FaTrophy,
} from "react-icons/fa";
import SubscriptionModal from "../components/Subscription/SubscriptionModal";

const plans = [
  {
    name: "Free",
    price: 0,
    features: [
      { text: "Daily Challenges", icon: <FaRocket /> },
      { text: "Basic Problems", icon: <FaCode /> },
      { text: "Pair Coding", icon: <FaUserFriends /> },
      { text: "Limited Progress Tracking", icon: <FaChartLine /> },
    ],
  },
  {
    name: "Pro",
    price: 12,
    features: [
      { text: "All Free Features", icon: <FaCheckCircle /> },
      { text: "Mock Interviews", icon: <FaBrain /> },
      { text: "Advanced Problems", icon: <FaTrophy /> },
      { text: "AI Suggestions", icon: <FaRobot /> },
      { text: "Visual Algorithm Flow", icon: <FaEye /> },
      { text: "Gamified Progress", icon: <FaChartLine /> },
    ],
  },
];

const Pricing = ({ isYearly, setIsYearly }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const API_ROOT = (
    import.meta.env.VITE_API_URL || "http://localhost:5000"
  ).replace(/\/+$/, "");
  const handleSubscribeClick = (plan) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.info("Please login to subscribe to premium features");
      navigate("/login", {
        state: {
          from: "/pricing",
          message: "You need to login to subscribe to our premium plans",
        },
      });
      return;
    }
    setSelectedPlan(plan.name);
    setShowModal(true);
  };

  const handleConfirmSubscription = async () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    try {
      const res = await fetch(`${API_ROOT}/stripe/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          billing: isYearly ? "yearly" : "monthly",
          plan: selectedPlan,
        }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate payment. Please try again.");
        console.error("Stripe response missing URL:", data);
      }
    } catch (err) {
      toast.error(err.message || "Subscription failed. Please try again.");
      console.error("Error during checkout:", err);
    } finally {
      setIsLoading(false);
      setShowModal(false);
    }
  };

  return (
    <section
      id="Pricing"
      className="bg-black py-20 px-6 text-white text-center backdrop-blur-lg"
    >
      <h2 className="text-3xl text-white font-bold mb-2">Pricing</h2>

      <p className="mb-8 text-sm text-gray-400">
        Choose a plan that fits your learning style.
      </p>

      <div className="flex justify-center mb-10">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-4 py-2 rounded-l-full ${
            !isYearly ? "bg-cyan-500 text-white" : "bg-gray-800"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-4 py-2 rounded-r-full ${
            isYearly ? "bg-cyan-500 text-white" : "bg-gray-800"
          }`}
        >
          Yearly (Save 20%)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col justify-between rounded-2xl p-6 border border-[#2d2d3a] bg-white/5 shadow-md text-left"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-4xl font-bold mb-4">
                {plan.price === 0
                  ? "Free"
                  : `$${isYearly ? plan.price * 10 : plan.price}`}
                <span className="text-base font-normal text-gray-400 ml-1">
                  /{isYearly ? "yr" : "mo"}
                </span>
              </p>
              <ul className="text-gray-300 space-y-3 text-sm mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-cyan-400">{feature.icon}</span>
                    {feature.text}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleSubscribeClick(plan)}
              className={`mt-auto w-full py-2 rounded-full transition ${
                plan.price === 0
                  ? "bg-gray-700 hover:bg-gray-600"
                  : "bg-cyan-500 hover:bg-cyan-600"
              }`}
            >
              {plan.price === 0 ? "Get Started" : "Go Pro"}
            </button>
          </motion.div>
        ))}
      </div>

      <SubscriptionModal
        isOpen={showModal}
        planName={selectedPlan}
        isYearly={isYearly}
        isLoading={isLoading}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmSubscription}
      />
    </section>
  );
};

export default Pricing;
