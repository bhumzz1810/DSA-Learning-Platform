import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo/dsalogoicon.svg";
import alertSound from "../assets/music/warning.mp3";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const LoginForm = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    audioRef.current = new Audio(alertSound);
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
    setError("");
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
    setError("");
  };

  const checkPasswordStrength = (pass) => {
    if (pass.length === 0) return "";
    if (pass.length < 6) return "Weak";
    if (
      !/[A-Z]/.test(pass) ||
      !/[0-9]/.test(pass) ||
      !/[^A-Za-z0-9]/.test(pass)
    ) {
      return "Medium";
    }
    return "Strong";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showLogin) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        setError("");
        navigate("/");
      } catch (err) {
        setError(err.message);
      }
    } else {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      if (passwordStrength === "Weak") {
        setError("Password is too weak");
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Signup successful!");
        setError("");
        handleLoginClick();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (error && containerRef.current) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      }
      const spans = containerRef.current.querySelectorAll("span");
      spans.forEach((span) => {
        span.style.animation = "none";
        void span.offsetWidth;
        span.style.animation = "glowRed 1s ease infinite";
      });
      return () => {
        if (containerRef.current) {
          const spans = containerRef.current.querySelectorAll("span");
          spans.forEach((span) => {
            span.style.animation = "none";
            void span.offsetWidth;
            span.style.animation =
              "blink 3s linear infinite, rotate 60s linear infinite";
            span.style.animationDelay = `calc(var(--i) * (3s / 50))`;
          });
        }
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    }
  }, [error]);

  return (
    <div className="app-container">
      <div className={`container ${error ? "error" : ""}`} ref={containerRef}>
        {[...Array(50)].map((_, i) => (
          <span key={i} style={{ "--i": i }}></span>
        ))}
        {!showLogin && !showSignup ? (
          <div className="button-container">
            <img src={logo} alt="Logo" className="logo" />
            <button className="btn main-btn" onClick={handleLoginClick}>
              Login
            </button>
            <button className="btn main-btn" onClick={handleSignupClick}>
              Sign Up
            </button>
          </div>
        ) : (
          <div className="login-box">
            <img src={logo} alt="Logo" className="logo-form" />
            <h2>{showLogin ? "Login" : "Sign Up"}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <input
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email</label>
              </div>
              <div className="input-box password-container">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <label>Password</label>
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
                {showSignup && password && (
                  <div
                    className={`password-strength ${passwordStrength.toLowerCase()}`}
                  >
                    Strength: {passwordStrength || "None"}
                  </div>
                )}
              </div>
              {showSignup && (
                <div className="input-box password-container">
                  <input
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label>Confirm Password</label>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              )}
              {showLogin && (
                <div className="forgot-pass">
                  <a href="#" tabIndex="0">
                    Forgot your password?
                  </a>
                </div>
              )}
              <button type="submit" className="btn">
                {showLogin ? "Login" : "Sign Up"}
              </button>
              <div className="signup-link">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    showLogin ? handleSignupClick() : handleLoginClick();
                  }}
                  tabIndex="0"
                >
                  {showLogin
                    ? "Don't have an account? Signup"
                    : "Already have an account? Login"}
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
