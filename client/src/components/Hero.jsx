import React from "react";
import bannerImg from "../assets/Homepage/heroimage.png";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="text-center py-10 px-4">
      <h1 className="text-4xl md:text-5xl font-semibold mb-2 mt-12">
        Master Data Structures <br /> & Algorithms Efficiently
      </h1>
      <p className="text-lg mb-10 text-gray-300 max-w-xl mx-auto">
        Interactive coding playground with visualizations, real-time feedback,
        and personalized learning paths.
      </p>
      <img
        src={bannerImg}
        alt="Devices"
        className="mx-auto max-w-[750px] mb-10"
      />
      <div className="flex justify-center gap-6">
        <button
          onClick={() => {
            navigate("/");
            setTimeout(() => {
              const featuresSection = document.getElementById("features");
              if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: "smooth" });
              }
            }, 100);
          }}
          className="min-w-[200px] px-6 py-2 rounded-full text-white   bg-white/10 border border-gray-300/40 hover:bg-white/20 transition"
        >
          Explore Features
        </button>
        <button
          onClick={() => {
            navigate("/problems");
          }}
          className="bg-cyan-400 min-w-[200px] text-black px-6 py-2 rounded-full hover:bg-cyan-300 transition"
        >
          Start Learning Now
        </button>
      </div>
      <p className="text-gray-400 text-xs mt-5">Start your journey today! </p>
    </section>
  );
};

export default Hero;
