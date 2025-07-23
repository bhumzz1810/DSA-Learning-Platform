import React, { useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom";

const Homepage = () => {
  const [isYearly, setIsYearly] = useState(false);
  const location = useLocation();
  useEffect(() => {
    if (location.state?.scrollToPricing) {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        pricingSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);
  return (
    <div className="w-full min-h-screen text-white font-sans">
      <div className="relative w-full h-screen overflow-hidden">
        <DarkVeil />
        <div className="relative z-10">
          <Hero />
        </div>
      </div>
      <About />
      <Features />
      <section id="pricing">
        <Pricing isYearly={isYearly} setIsYearly={setIsYearly} />
      </section>{" "}
      <Testimonials />
      <Newsletter />
      <Contact />
      <Footer />
    </div>
  );
};

export default Homepage;
