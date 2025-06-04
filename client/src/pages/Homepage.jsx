import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import TestimonialCard from './TestimonialCard';
import PricingCard from './PricingCard.jsx';
import dashboardImage from '../assets/images/dashboard-preview.png';
import feature1Icon from '../assets/icons/feature1.svg';
import feature2Icon from '../assets/icons/feature2.svg';
import feature3Icon from '../assets/icons/feature3.svg';

const LandingPage = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Computer Science Student",
      content: "This platform helped me master data structures in just 3 months! The interactive lessons are incredible.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Software Engineer",
      content: "The practice problems with instant feedback helped me ace my technical interviews. Highly recommended!",
      rating: 5
    }
  ];

  const features = [
    {
      icon: feature1Icon,
      title: "Interactive Learning",
      description: "Learn with visualizations and step-by-step guidance"
    },
    {
      icon: feature2Icon,
      title: "Real-time Coding",
      description: "Practice directly in the browser with instant feedback"
    },
    {
      icon: feature3Icon,
      title: "Progress Tracking",
      description: "Monitor your improvement with detailed analytics"
    }
  ];

  return (
    <div className="landing-page">
      <Header isAuthenticated={false} onLogout={() => {}} />
      
      {/* 1. Banner Section */}
      <section className="banner-section">
        <div className="banner-content">
          <h1>Master Data Structures & Algorithms</h1>
          <p>Interactive learning platform designed to help you conquer technical interviews</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn primary-btn">Get Started Free</Link>
            <Link to="/login" className="btn secondary-btn">Login</Link>
          </div>
        </div>
        <div className="banner-image">
          <img src={dashboardImage} alt="DSA Learning Platform Preview" />
        </div>
      </section>

      {/* 2. Dashboard Overview */}
      <section className="dashboard-section">
        <div className="section-header">
          <h2>Powerful Learning Dashboard</h2>
          <p>Track your progress and focus on areas that need improvement</p>
        </div>
        <div className="dashboard-preview">
          <img src={dashboardImage} alt="Dashboard Preview" />
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <img src={feature.icon} alt={feature.title} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Free/Premium */}
      <section className="pricing-section">
        <div className="section-header">
          <h2>Choose Your Plan</h2>
          <p>Start learning today with our free tier or unlock premium features</p>
        </div>
        <div className="pricing-cards">
          <PricingCard 
            title="Free" 
            price="0" 
            features={[
              "Basic DSA lessons",
              "Limited practice problems",
              "Community support",
              "Progress tracking"
            ]} 
            ctaText="Get Started"
          />
          <PricingCard 
            title="Premium" 
            price="9.99" 
            features={[
              "All DSA lessons",
              "Unlimited practice problems",
              "Priority support",
              "Advanced analytics",
              "Interview preparation",
              "Certificate of completion"
            ]} 
            ctaText="Go Premium"
            featured={true}
          />
        </div>
      </section>

      {/* 4. About */}
      <section className="about-section">
        <div className="about-content">
          <h2>About Our Platform</h2>
          <p>Our mission is to make data structures and algorithms accessible to everyone. Founded in 2023 by a team of computer science educators and industry professionals, we've helped over 10,000 students improve their coding skills.</p>
          <p>We believe in learning by doing - that's why our platform focuses on interactive coding exercises with immediate feedback, rather than passive video lectures.</p>
          <Link to="/about" className="btn secondary-btn">Learn More</Link>
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71" alt="Team working on code" />
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>What Our Students Say</h2>
          <p>Hear from learners who transformed their coding skills with our platform</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </section>

      {/* 6. Contact Us */}
      <section className="contact-section">
        <div className="contact-form">
          <h2>Contact Us</h2>
          <form>
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="5" required></textarea>
            </div>
            <button type="submit" className="btn primary-btn">Send Message</button>
          </form>
        </div>
        <div className="contact-map">
          <iframe 
            title="Office Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.215256627466!2d-73.9878446845938!3d40.7484404793279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus" 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src={logo} alt="DSA Learning Platform" />
            <p>Master Data Structures & Algorithms</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Platform</h4>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/examples">Examples</Link>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <Link to="/blog">Blog</Link>
              <Link to="/tutorials">Tutorials</Link>
              <Link to="/docs">Documentation</Link>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 DSA Learning Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;