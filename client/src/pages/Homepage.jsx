import React from "react";
import "../index.css";
import "./Homepage.css";
import bannerImg from "../assets/Homepage/banner_img.png";
import ship from "../assets/icons/ship.png";
import timer from "../assets/icons/timer.png";
import handshake from "../assets/icons/handshake.png";
import free from "../assets/free.png";
import pro from "../assets/pro.png";

const Homepage = () => {
  // For billing toggle state
  const [isMonthly, setIsMonthly] = React.useState(true);

  // Testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      rating: 4,
      text: "DSArena helped me ace my technical interviews. The interactive challenges are the closest thing to real coding tests."
    },
    {
      name: "Michael Chen",
      role: "CS Student",
      rating: 5,
      text: "The visual explanations of algorithms made complex concepts click for me. Worth every penny of the Pro plan!"
    },
    {
      name: "Emily Rodriguez",
      role: "Bootcamp Grad",
      rating: 5,
      text: "Went from zero to confident in data structures within 3 months. The community support is incredible."
    }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <div className="tag">&lt;DSArena/&gt;</div>
          <h1 className="headline">Master Data Structures & Algorithms Efficiently</h1>
          <p className="subtext">
            Interactive coding playground with visualizations, real-time feedback, 
            and personalized learning paths.
          </p>
          <button className="explore-btn">Start Learning Now</button>
        </div>
        <div className="hero-right">
          <img 
            src={bannerImg} 
            alt="Interactive code editor with algorithm visualization" 
            className="banner-img" 
          />
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="section-title">Why Choose DSArena?</h2>
        <p className="section-subtitle">
          We're revolutionizing how developers learn computer science fundamentals
        </p>

        <div className="about-grid">
          <div className="about-left">
            <h3 className="about-heading">Our Learning Philosophy</h3>
            <p className="about-desc">
              Traditional coding platforms focus on solutions. We emphasize the <strong>problem-solving process</strong> 
              with step-by-step visualizations, complexity analysis, and pattern recognition techniques 
              used by FAANG engineers.
            </p>
            <a href="/about" className="about-link">
              Our Methodology →
            </a>

            <div className="about-icons-list">
              <div className="icon-item">
                <img src={ship} alt="Fast Learning" className="icon-circle" />
                <p><strong>Accelerated Learning:</strong> Master concepts 2x faster with our spatial repetition system</p>
              </div>
              <div className="icon-item">
                <img src={timer} alt="Time Efficient" className="icon-circle" />
                <p><strong>Time-Efficient:</strong> 15-min daily challenges that fit your schedule</p>
              </div>
              <div className="icon-item">
                <img src={handshake} alt="Community" className="icon-circle" />
                <p><strong>Expert Community:</strong> Get unstuck with help from senior engineers</p>
              </div>
            </div>
          </div>

          <div className="about-right">
            <div className="stats-container">
              <div className="stat-item">
                <h4>10,000+</h4>
                <p>Active Learners</p>
              </div>
              <div className="stat-item">
                <h4>350+</h4>
                <p>Hands-on Challenges</p>
              </div>
              <div className="stat-item">
                <h4>92%</h4>
                <p>Interview Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2 className="section-title">Plans That Fit Your Goals</h2>
        <p className="section-subtitle">
          Start for free, upgrade when you're ready for advanced features
        </p>

        <div className="billing-toggle">
          <button 
            className={`billing-btn ${isMonthly ? 'active' : ''}`}
            onClick={() => setIsMonthly(true)}
          >
            Monthly
          </button>
          <button 
            className={`billing-btn ${!isMonthly ? 'active' : ''}`}
            onClick={() => setIsMonthly(false)}
          >
            Yearly (2 months free)
          </button>
        </div>

        <div className="pricing-cards">
          {/* Free Plan */}
          <div className="pricing-card free-card">
            <div className="plan-header">
              <img src={free} alt="Free Plan" />
              <h3>Free</h3>
            </div>
            <p className="plan-description">
              Perfect for getting started with DSA basics
            </p>
            <h2 className="plan-price">
              $0 <span>/month</span>
            </h2>
            <ul className="plan-features">
              <li>✔️ 50+ beginner challenges</li>
              <li>✔️ Basic algorithm visualizations</li>
              <li>✔️ Community support</li>
              <li>❌ Advanced patterns</li>
              <li>❌ Interview simulations</li>
            </ul>
            <button className="start-btn outline">Start Learning</button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card pro-card">
            <div className="plan-header">
              <img src={pro} alt="Pro Plan" />
              <div className="pro-title">
                <h3>Pro</h3>
                <span className="badge">Most Popular</span>
              </div>
            </div>
            <p className="plan-description">
              Everything you need for technical interview mastery
            </p>
            <h2 className="plan-price">
              ${isMonthly ? '12' : '10'} <span>/{isMonthly ? 'month' : 'year'}</span>
            </h2>
            <ul className="plan-features">
              <li>✔️ 350+ challenges</li>
              <li>✔️ Advanced visualizations</li>
              <li>✔️ Mock interviews</li>
              <li>✔️ Personalized coaching</li>
              <li>✔️ Priority support</li>
            </ul>
            <button className="start-btn filled">Get Pro Access</button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <h2 className="section-title">Success Stories</h2>
        <p className="section-subtitle">
          Join thousands of developers who transformed their careers
        </p>

        <div className="testimonial-cards">
          {testimonials.map((testimonial, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="profile-pic">
                {testimonial.name.charAt(0)}
              </div>
              <h4 className="testimonial-name">{testimonial.name}</h4>
              <p className="testimonial-role">{testimonial.role}</p>

              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < testimonial.rating ? '★' : '☆'}</span>
                ))}
              </div>

              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2 className="section-title">Have Questions?</h2>
        <p className="section-subtitle">
          We're here to help you on your DSA journey
        </p>

        <div className="contact-wrapper">
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" required />
              <input type="text" placeholder="Last Name" required />
            </div>
            <input type="email" placeholder="Email Address" required />
            <textarea 
              rows="4" 
              placeholder="Your message" 
              required
            ></textarea>
            <button type="submit" className="send-btn">
              Send Message
            </button>
          </form>

          <div className="contact-info">
            <h3>Other Ways to Connect</h3>
            <p>Email: <a href="mailto:support@dsarena.com">support@dsarena.com</a></p>
            <p>Discord: <a href="#">Join our community</a></p>
            <p>Office Hours: Mon-Fri, 9AM-5PM EST</p>
            
            <div className="contact-map">
              <iframe
                title="DSArena Headquarters"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2813.5674310660425!2d-80.55818798471027!3d43.472285279126465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf41df7e206e9%3A0x3aa39b5b9f91e26e!2sConestoga%20College!5e0!3m2!1sen!2sca!4v1682100276142!5m2!1sen!2sca"
                width="100%"
                height="300"
                style={{ border: 0, borderRadius: "12px" }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;