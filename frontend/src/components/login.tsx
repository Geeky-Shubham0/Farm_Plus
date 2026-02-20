import { FaMobileAlt, FaLock } from "react-icons/fa";
import { MdLanguage, MdVolumeUp } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-bg" />

      <div className="login-card">
        <div className="login-card-body">

          {/* Logo */}
          <div className="login-logo" onClick={() => navigate('/')}>
            <span className="login-logo-icon">🌿</span>
            <span className="login-logo-text">Farm+</span>
          </div>

          <h2 className="login-title">Welcome Back!</h2>
          <p className="login-subtitle">Access your Smart Farming Dashboard</p>

          {/* Mobile / Email */}
          <div className="login-input-group">
            <span className="input-icon"><FaMobileAlt size={18} /></span>
            <input type="text" placeholder="Mobile Number / Email" />
          </div>

          {/* Password */}
          <div className="login-input-group">
            <span className="input-icon"><FaLock size={18} /></span>
            <input type="password" placeholder="Password" />
            <span className="lock-icon"><FaLock size={16} /></span>
          </div>

          {/* Remember + Forgot */}
          <div className="login-options">
            <label className="login-remember">
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="/forgot-password" className="login-forgot">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button className="login-btn">Log In</button>

          {/* Divider */}
          <div className="login-divider"><span>or</span></div>

          {/* Sign Up */}
          <p className="login-signup">
            Don't have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
              Sign Up Now
            </a>
          </p>
        </div>

        {/* Language Bar */}
        <div className="login-lang-bar">
          <span className="globe-icon"><MdLanguage size={18} /></span>
          <span className="lang-option active">English</span>
          <span className="lang-sep">|</span>
          <span className="lang-option">ਪੰਜਾਬੀ</span>
          <span className="lang-sep">|</span>
          <span className="lang-option">Hindi</span>
          <span className="lang-sound"><MdVolumeUp size={18} /></span>
        </div>
      </div>
    </div>
  );
};

export default Login;