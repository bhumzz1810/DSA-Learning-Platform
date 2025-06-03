import React, { useState, useRef, useEffect } from 'react';

const LoginForm = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Test credentials
    if (email === 'va@gmail.com' && password === '123456') {
      // Successful login logic here
      alert('Login successful!');
      setError(false);
    } else {
      setError(true);
      // Reset error after animation
      setTimeout(() => setError(false), 3000);
    }
  };

  // Effect for error animation
  useEffect(() => {
    if (error && containerRef.current) {
      const spans = containerRef.current.querySelectorAll('span');
      spans.forEach(span => {
        span.style.animation = 'glowRed 0.5s ease 3';
      });
      
      const timer = setTimeout(() => {
        spans.forEach(span => {
          span.style.animation = 'blink 3s linear infinite';
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="app-container">
      <div className={`container ${error ? 'error' : ''}`} ref={containerRef}>
        {[...Array(50)].map((_, i) => (
          <span key={i} style={{ '--i': i }}></span>
        ))}

        {!showLogin && !showSignup ? (
          <div className="button-container">
            <button className="btn main-btn" onClick={handleLoginClick}>Login</button>
            <button className="btn main-btn" onClick={handleSignupClick}>Sign Up</button>
          </div>
        ) : showLogin ? (
          <div className="login-box">
            <h2>Login</h2>
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
              <div className="input-box">
                <input 
                  name="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label>Password</label>
              </div>
              <div className="forgot-pass">
                <a href="#">Forgot your password?</a>
              </div>
              <button type="submit" className="btn">Login</button>
              <div className="signup-link">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handleSignupClick();
                }}>Don't have an account? Signup</a>
              </div>
            </form>
          </div>
        ) : (
          <div className="login-box">
            <h2>Sign Up</h2>
            <form>
              <div className="input-box">
                <input name="email" type="email" required />
                <label>Email</label>
              </div>
              <div className="input-box">
                <input name="password" type="password" required />
                <label>Password</label>
              </div>
              <div className="input-box">
                <input name="confirm-password" type="password" required />
                <label>Confirm Password</label>
              </div>
              <button type="submit" className="btn">Sign Up</button>
              <div className="signup-link">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handleLoginClick();
                }}>Already have an account? Login</a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;