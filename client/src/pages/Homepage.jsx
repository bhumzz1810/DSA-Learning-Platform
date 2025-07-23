import React from "react";
import Navbar from "../components/Navbar/Navbar";
import DarkVeil from "../components/Darkveil";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Pricing from "./PricingCard";
import Testimonials from "./TestimonialCard";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import About from "../components/About";

const Homepage = () => {
  return (
    <div className="w-full min-h-screen text-white font-sans">

      {/* 🔥 Only Hero Section gets the animated background */}
      <div className="relative w-full h-screen overflow-hidden">
        <DarkVeil />
        <div className="relative z-10">
          <Hero />
        </div>
      </div>

      {/* 🔻 Other sections below */}
      <About />
      <Features />
      <Pricing />
      <Testimonials />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
};

export default Homepage;
