import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import bannerImg from "../assets/Homepage/banner_img.png";
import ship from "../assets/icons/ship.png";
import timer from "../assets/icons/timer.png";
import handshake from "../assets/icons/handshake.png";
import free from "../assets/free.png";
import pro from "../assets/pro.png";
import { motion } from "framer-motion";

const AnimatedBackground = () => (
  <motion.div
    className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-800 opacity-20 z-0"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 2, ease: "easeInOut" }}
  />
);

const Homepage = () => {
  const navigate = useNavigate();
  const [isMonthly, setIsMonthly] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#pricing") {
      const pricingSection = document.getElementById("pricing");
      if (pricingSection) {
        // Smooth scroll to pricing section
        setTimeout(() => {
          pricingSection.scrollIntoView({ behavior: "smooth" });
        }, 100); // Delay ensures DOM is fully rendered
      }
    }
  }, []);

  const testimonials = [
    {
      name: "Divyanshu",
      role: "Software Engineer",
      rating: 4,
      text: "DSArena helped me ace my technical interviews. The interactive challenges are the closest thing to real coding tests.",
    },
    {
      name: "Nanji 160",
      role: "CS Student",
      rating: 5,
      text: "The visual explanations of algorithms made complex concepts click for me. Worth every penny of the Pro plan!",
    },
    {
      name: "Emily Rodriguez",
      role: "Bootcamp Grad",
      rating: 5,
      text: "Went from zero to confident in data structures within 3 months. The community support is incredible.",
    },
  ];

  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2 space-y-6">
            <span className="inline-block bg-gray-900 text-yellow-400 px-4 py-1 rounded-full text-sm font-bold">
              &lt;DSArena/&gt;
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              Master Data Structures & Algorithms Efficiently
            </h1>
            <p className="text-lg text-gray-600 max-w-md">
              Interactive coding playground with visualizations, real-time
              feedback, and personalized learning paths.
            </p>
            <button
              onClick={() => navigate("/Problems")}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              Start Learning Now
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src={bannerImg}
              alt="Interactive code editor with algorithm visualization"
              className="max-w-full h-auto rounded-xl shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-20 bg-white">
        <AnimatedBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold text-gray-900">
              Why Choose DSArena?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing how developers learn computer science
              fundamentals
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Our Learning Philosophy
              </h3>
              <p className="text-gray-600">
                Traditional coding platforms focus on solutions. We emphasize
                the{" "}
                <strong className="text-blue-500">
                  problem-solving process
                </strong>{" "}
                with step-by-step visualizations, complexity analysis, and
                pattern recognition techniques usedss by FAANG engineers.
              </p>
              <a
                href="/about"
                className="inline-flex items-center text-blue-600 font-medium mt-6"
              >
                Our Methodology
                <svg
                  className="ml-2 w-4 h-4 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </a>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-500 p-2 rounded-full text-white">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Accelerated Learning
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Master concepts 2x faster with our spatial repetition
                      system.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-gray-700 p-2 rounded-full text-white">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Time-Efficient
                    </h4>
                    <p className="text-gray-600 text-sm">
                      15-min daily challenges that fit your schedule.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-500 p-2 rounded-full text-white">
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      Expert Community
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Get unstuck with help from senior engineers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <motion.div
                className="bg-blue-100 p-6 rounded-xl text-center shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
              >
                <span className="text-4xl font-bold text-blue-600">
                  10,000+
                </span>
                <p className="mt-2 text-gray-600">Active Learners</p>
              </motion.div>
              <motion.div
                className="bg-yellow-100 p-6 rounded-xl text-center shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <span className="text-4xl font-bold text-yellow-600">350+</span>
                <p className="mt-2 text-gray-600">Hands-on Challenges</p>
              </motion.div>
              <motion.div
                className="bg-green-100 p-6 rounded-xl text-center shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
              >
                <span className="text-4xl font-bold text-green-600">92%</span>
                <p className="mt-2 text-gray-600">Interview Success Rate</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Plans That Fit Your Goals
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Start for free, upgrade when you're ready for advanced features
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <div className="inline-flex bg-gray-100 rounded-full p-1">
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  isMonthly ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
                onClick={() => setIsMonthly(true)}
              >
                Monthly
              </button>
              <button
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  !isMonthly ? "bg-white shadow text-gray-900" : "text-gray-600"
                }`}
                onClick={() => setIsMonthly(false)}
              >
                Yearly (2 months free)
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <img src={free} alt="Free Plan" className="w-10 h-10" />
                  <h3 className="text-xl font-bold text-gray-900">Free</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Perfect for getting started with DSA basics
                </p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">$0</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    50+ beginner challenges
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Basic algorithm visualizations
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Community support
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg
                      className="w-5 h-5 text-red-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Advanced patterns
                  </li>
                  <li className="flex items-center text-gray-400">
                    <svg
                      className="w-5 h-5 text-red-400 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Interview simulations
                  </li>
                </ul>
                <button
                  onClick={() => navigate("/Problems")}
                  className="w-full py-3 px-4 border border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors"
                >
                  Start Learning
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="flex-1 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg overflow-hidden relative">
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <img src={pro} alt="Pro Plan" className="w-10 h-10" />
                  <h3 className="text-xl font-bold text-gray-900">Pro</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Everything you need for technical interview mastery
                </p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">
                    ${isMonthly ? "12" : "10"}
                  </span>
                  <span className="text-gray-500">
                    /{isMonthly ? "month" : "year"}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    350+ challenges
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Advanced visualizations
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Mock interviews
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Personalized coaching
                  </li>
                  <li className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <button
                  onClick={() =>
                    navigate("/subscribe", {
                      state: {
                        plan: "pro",
                        billing: isMonthly ? "monthly" : "yearly",
                      },
                    })
                  }
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
                >
                  Get Pro Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Success Stories
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Join thousands of developers who transformed their careers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 text-blue-600 text-xl font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <h4 className="text-center font-semibold text-gray-900">
                  {testimonial.name}
                </h4>
                <p className="text-center text-gray-500 text-sm mb-4">
                  {testimonial.role}
                </p>
                <div className="flex justify-center mb-4 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < testimonial.rating ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="text-center text-gray-600 italic">
                  "{testimonial.text}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">
              Have Questions?
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              We're here to help you on your DSA journey
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            <form className="lg:w-1/2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    required
                  />
                </div>
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                />
              </div>
              <div>
                <textarea
                  rows="4"
                  placeholder="Your message"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full py-3 px-6 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-colors shadow-md"
              >
                Send Message
              </button>
            </form>

            <div className="lg:w-1/2 space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Other Ways to Connect
              </h3>
              <div className="space-y-4">
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span>{" "}
                  <a
                    href="mailto:support@dsarena.com"
                    className="text-blue-600 hover:underline"
                  >
                    support@dsarena.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Discord:</span>{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Join our community
                  </a>
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Office Hours:</span> Mon-Fri,
                  9AM-5PM EST
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <iframe
                  title="DSArena Headquarters"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2813.5674310660425!2d-80.55818798471027!3d43.472285279126465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf41df7e206e9%3A0x3aa39b5b9f91e26e!2sConestoga%20College!5e0!3m2!1sen!2sca!4v1682100276142!5m2!1sen!2sca"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
