import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Divyanshu",
    role: "Software Engineer",
    rating: 4,
    avatar: "../assets/avatar.jpg",
    text: "DSArena helped me ace my technical interviews. The interactive challenges are the closest thing to real coding tests.",
  },
  {
    name: "Nanji 160",
    role: "CS Student",
    rating: 5,
    avatar: "../assets/avatar.jpg",
    text: "The visual explanations of algorithms made complex concepts click for me. Worth every penny of the Pro plan!",
  },
  {
    name: "Emily Rodriguez",
    role: "Bootcamp Grad",
    rating: 5,
    avatar: "../assets/avatar.jpg",
    text: "Went from zero to confident in data structures within 3 months. The community support is incredible.",
  },
];

const StarRating = ({ count }) => (
  <div className="flex gap-1 text-yellow-400 mb-2">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < count ? "★" : "☆"}</span>
    ))}
  </div>
);

const Testimonials = () => {
  return (
    <section className="bg-[#0a0f1f] py-20 px-6 text-white text-center">
      <h3 className="text-3xl text-white font-semibold mb-2">What Our Users Say</h3>
      <p className="mb-10 text-gray-400">Real feedback from real learners.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((t, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-md border border-[#2d2d3a] rounded-2xl p-6 text-left hover:border-cyan-500 transition duration-300 shadow-md"
          >
            <StarRating count={t.rating} />
            <p className="text-sm text-gray-300 mb-6">"{t.text}"</p>
            <div className="flex items-center gap-4 mt-auto">
              <img
                src={t.avatar}
                alt={`${t.name}'s avatar`}
                className="w-12 h-12 rounded-full border border-cyan-400"
              />
              <div>
                <h4 className="text-base font-semibold">{t.name}</h4>
                <p className="text-xs text-gray-400">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
