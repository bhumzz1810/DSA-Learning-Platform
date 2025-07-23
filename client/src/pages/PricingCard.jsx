import React, { useState } from "react";
import { motion } from "framer-motion";
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
    popular: false,
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
    popular: true,
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section className=" py-20 px-6 text-white text-center backdrop-blur-lg">
      <h2 className="text-3xl font-bold mb-2">Pricing</h2>
      <p className="mb-8 text-gray-400">Choose a plan that fits your learning style.</p>

      <div className="flex justify-center mb-10">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-4 py-2 rounded-l-full ${!isYearly ? "bg-cyan-500 text-white" : "bg-gray-800"
            }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-4 py-2 rounded-r-full ${isYearly ? "bg-cyan-500 text-white" : "bg-gray-800"
            }`}
        >
          Yearly (Save 20%)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`relative rounded-2xl p-6 border border-[#2d2d3a] bg-white/5 backdrop-blur-md shadow-md text-left transition hover:border-cyan-500 ${plan.popular ? "ring-2 ring-cyan-500" : ""
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 right-4 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                Most Popular
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-4xl font-bold mb-4">
              {plan.price === 0 ? "Free" : `$${isYearly ? plan.price * 10 : plan.price}`}
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
            <button className="w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition">
              {plan.price === 0 ? "Get Started" : "Go Pro"}
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
