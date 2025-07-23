import React from "react";
import bannerImg from "../assets/Homepage/heroimage.png"

const Hero = () => {
    return (
        <section className="text-center py-20 px-4">
            <h1 className="text-4xl md:text-5xl font-semibold mb-4">
                Master Data Structures <br /> & Algorithms Efficiently
            </h1>
            <p className="text-lg mb-10 text-gray-300 max-w-xl mx-auto">
                Interactive coding playground with visualizations, real-time feedback, and personalized learning paths.
            </p>
            <img src={bannerImg} alt="Devices" className="mx-auto max-w-[500px] mb-10" />
            <div className="flex justify-center gap-6">
                <button className="bg-cyan-400 min-w-[200px] text-black px-6 py-2 rounded-full hover:bg-cyan-300 transition">Start Learning Now</button>
                <button className="bg-cyan-400 min-w-[200px] text-black px-6 py-2 rounded-full hover:bg-cyan-300 transition">Explore</button>
            </div>
        </section>
    );
};

export default Hero;
