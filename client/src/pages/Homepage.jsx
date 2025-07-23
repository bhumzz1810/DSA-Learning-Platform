import React from "react";
import Navbar from "../components/Navbar/Navbar";
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
    <div className="min-h-screen bg-[#0a0f1f] text-white font-sans">
      <Hero />
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
