import React from "react";
import { motion } from "framer-motion";
import { FaBolt, FaClock, FaUsers } from "react-icons/fa";

const aboutCards = [
  {
    icon: <FaBolt size={24} />,
    title: "Accelerated Learning",
    description: "Master concepts 2x faster with our spatial repetition system.",
    bg: "bg-gradient-to-br from-cyan-600/30 to-cyan-800/30"
  },
  {
    icon: <FaClock size={24} />,
    title: "Time-Efficient",
    description: "15-min daily challenges that fit your schedule.",
    bg: "bg-gradient-to-br from-gray-600/30 to-gray-800/30"
  },
  {
    icon: <FaUsers size={24} />,
    title: "Expert Community",
    description: "Get unstuck with help from senior engineers.",
    bg: "bg-gradient-to-br from-green-600/30 to-green-800/30"
  }
];

const About = () => {
  return (
    <section className="bg-[#000000] py-10 px-6 text-white text-center relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl text-white font-bold mb-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Why Choose DSArena?
        </motion.h2>
        <motion.p
          className="text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We're revolutionizing how developers learn computer science fundamentals.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {aboutCards.map((card, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl shadow-lg border border-white/10 backdrop-blur-md ${card.bg}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-4 text-cyan-400">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-300 text-sm">{card.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
