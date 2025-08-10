import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/Logo/dsalogoicon.svg";
import alertSound from "../../public/music/warning.mp3";
import { toast } from "react-toastify";

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

  // const speak = (msg) => {
  //   const speech = new SpeechSynthesisUtterance(msg);
  //   speechSynthesis.speak(speech);
  // };

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
    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";
    try {
      const endpoint = showLogin ? "auth/login" : "auth/register";
      const payload = showLogin
        ? { email, password }
        : { email, username: email.split("@")[0], password };

      const res = await fetch(`${apiUrl}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // ✅ Save user too

      // ✅ Decode token to get user role
      const payloadData = JSON.parse(atob(data.token.split(".")[1]));
      const role = payloadData.role;
      localStorage.setItem("role", role);

      toast.success(`${showLogin ? "Login" : "Signup"} successful!`, {
        position: "top-right",
        autoClose: 2500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // ✅ Delay redirect until after 2.5s so alert is visible
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin/problems");
        } else {
          navigate("/dashboard");
        }
      }, 1500); // enough time to show the popup
    } catch (err) {
      setError(err.message);
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
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}
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
                  <>
                    <div
                      className={`password-strength ${passwordStrength.toLowerCase()}`}
                    >
                      Strength: {passwordStrength || "None"}
                    </div>
                    {passwordStrength === "Weak" && (
                      <div className="password-hint" role="tooltip">
                        Use at least 6 characters, including a number, uppercase
                        letter, and symbol.
                      </div>
                    )}
                  </>
                )}
              </div>
              {showSignup && (
                <div className="input-box password-container">
                  <input
                    name="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onPaste={(e) => e.preventDefault()}
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
            <hr className="my-6 border-t border-gray-300 w-full" />

            <div className="mt-6 w-full flex flex-col items-center">
              <p className="text-sm text-gray-500 mb-2">or continue with</p>

              <div className="flex flex-col w-full gap-3 max-w-xs">
                <a
                  href="http://localhost:5000/auth/google"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition duration-200"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                    alt="Google"
                    className="w-5 h-5"
                  />
                  Sign in with Google
                </a>

                <a
                  href="http://localhost:5000/auth/github"
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white text-sm font-medium rounded-md hover:bg-gray-900 transition duration-200"
                >
                  <img
                    src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                    alt="GitHub"
                    className="w-5 h-5"
                  />
                  Sign in with GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="fixed top-6 right-6 z-50 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-lg shadow-md flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636l-12.728 12.728M5.636 5.636l12.728 12.728"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
