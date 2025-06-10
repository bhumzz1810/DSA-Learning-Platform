
import React from "react";
import "../index.css";
import "./Homepage.css";
import bannerImg from "../assets/Homepage/banner_img.png";
import ship from "../assets/icons/ship.png";
import timer from "../assets/icons/timer.png";
import handshake from "../assets/icons/handshake.png";
import free from "../assets/free.png";
import pro from "../assets/pro.png";
import map from "../assets/map.png"; // Placeholder for map image

const Homepage = () => {
  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-left">
          <div className="tag">&lt;DSArena/&gt;</div>
          <h1 className="headline">
            Practice DSA <br /> the Modern Way
          </h1>
          <p className="subtext">
            Build your skills with interactive challenges and detailed
            explanations.
          </p>
          <button className="explore-btn">Explore Now</button>
        </div>

        <div className="hero-right">
          <div className="img-wrapper">
            <img src={bannerImg} alt="Code mockup" className="banner-img" />
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2 className="section-title">Who Are We?</h2>
        <p className="section-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>

        <div className="about-grid">
          <div className="about-left">
            <h3 className="about-heading">Read More About Us</h3>
            <h4 className="about-subheading">The most important</h4>
            <p className="about-desc">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <a href="#" className="about-link">
              More about Us →
            </a>

            <div className="about-icons-list">
              <div className="icon-item">
                <img src={ship} alt="Icon 2" className="icon-circle" />
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
              </div>
              <div className="icon-item">
                <img src={timer} alt="Icon 2" className="icon-circle" />
                <p>Lorem ipsum dolor sit amet,</p>
              </div>
              <div className="icon-item">
                <img src={handshake} alt="Icon 3" className="icon-circle" />
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod
                </p>
              </div>
            </div>
          </div>

          <div className="about-right">
            <div className="about-image">Image Placeholder</div>
          </div>
        </div>

        <div className="cards-row">
          <div className="about-card">
            <div className="card-image"></div>
            <h5>Lorem Ipsum</h5>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>

          <div className="feature-col">
            <div className="feature-item">✈️ Lorem Ipsum</div>
            <div className="feature-item">🧠 Lorem Ipsum</div>
            <div className="feature-item">📦 Lorem Ipsum</div>
            <div className="feature-item">🛠️ Lorem Ipsum</div>
          </div>
        </div>
      </section>

      <section className="pricing-section">
        <h2 className="section-title">Plans & Pricing</h2>
        <p className="section-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>

        <div className="billing-toggle">
          <button className="billing-btn active">Monthly</button>
          <button className="billing-btn">Yearly</button>
        </div>

        <div className="pricing-cards">
          {/* Free Plan */}
          <div className="pricing-card free-card">
            <div className="plan-header">
              <img src={free} alt="Free Plan Icon" />
              <h3>Free</h3>
            </div>
            <p className="plan-description">
              Unleash the Power with the Free Tier Plan
            </p>
            <h2 className="plan-price">
              <hr className="plan-divider" />
              $0 <span>/per month</span>
            </h2>
            <ul className="plan-features">
              <li>✔️ Lorem Ipsum</li>
              <li>✔️ Lorem Ipsum</li>
              <li>✔️ Lorem Ipsum</li>
              <li>❌ Lorem Ipsum</li>
              <li>❌ Lorem Ipsum</li>
            </ul>
            <button className="start-btn outline">Get Started</button>
          </div>

          {/* Pro Plan */}
          <div className="pricing-card pro-card">
            <div className="plan-header">
              <img src={pro} alt="Pro Plan Icon" />
              <div className="pro-title">
                <h3>Pro</h3>
                <span className="badge">Best offer</span>
              </div>
            </div>
            <p className="plan-description">
              Take Your Business to the Next Level with Pro Plan.
            </p>
            <h2 className="plan-price">
              $12 <span>/per month</span>
            </h2>
            <ul className="plan-features">
              <li>✔️ Lorem Ipsum</li>
              <li>✔️ Lorem Ipsum</li>
              <li>✔️ Lorem Ipsum</li>
              <li>✔️ Lorem Ipsum</li>
              <li>✔️ Lorem Ipsum</li>
            </ul>
            <button className="start-btn filled">Get Started</button>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <h2 className="section-title">Read Our Client Testimonials</h2>
        <p className="section-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>

        <div className="testimonial-cards">
          {[1, 2, 3].map((_, idx) => (
            <div className="testimonial-card" key={idx}>
              <div className="profile-pic"></div>
              <h4 className="testimonial-name">John Doe</h4>
              <p className="testimonial-role">UI/UX Designer</p>

              <div className="testimonial-stars">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                {idx === 0 ? <span>☆</span> : <span>★</span>}
              </div>

              <p className="testimonial-text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua quis
                nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo consequat.
              </p>
            </div>

          ))}
        </div>
      </section>

      <section className="contact-section">
        <h2 className="section-title">Reach us At</h2>
        <p className="section-subtitle">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor
        </p>

        <div className="contact-wrapper">
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="First Name" />
              <input type="text" placeholder="Last Name" />
            </div>
            <input type="email" placeholder="Email Address" />
            <textarea rows="4" placeholder="Your message"></textarea>

            {/* <div className="checkbox-row">
              <input type="checkbox" id="agree" />
              <label htmlFor="agree">
                I agree to the <a>Terms and Conditions</a>.
              </label>
            </div> */}

            <button type="submit" className="send-btn">
              Send Message
            </button>
          </form>

          <div className="contact-map">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2813.5674310660425!2d-80.55818798471027!3d43.472285279126465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882bf41df7e206e9%3A0x3aa39b5b9f91e26e!2sConestoga%20College!5e0!3m2!1sen!2sca!4v1682100276142!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

export default LandingPage;

