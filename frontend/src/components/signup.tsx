import { FaUser, FaMapMarkerAlt, FaMobileAlt, FaKey } from "react-icons/fa";
import { MdLandscape } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="signup-page">
      <div className="signup-bg" />

      <div className="signup-wrapper">
        <div className="signup-card">

          {/* Logo */}
          <div className="signup-logo" onClick={() => navigate('/')}>
            <span className="signup-logo-icon">🌿</span>
            <span className="signup-logo-text">Farm+</span>
          </div>

          <h2 className="signup-card-title">
            <FaUser size={18} /> Farmer Profile Creation
          </h2>

          {/* Full Name */}
          <div className="signup-input-group">
            <span className="input-icon"><FaUser size={16} /></span>
            <input type="text" placeholder="Full Name" />
          </div>

          {/* Address */}
          <div className="signup-input-group">
            <span className="input-icon"><FaMapMarkerAlt size={16} /></span>
            <input type="text" placeholder="Address" />
          </div>

          {/* State + City row */}
          <div className="signup-row">
            <div className="signup-input-group half">
              <span className="input-icon"><FaMapMarkerAlt size={14} /></span>
              <input type="text" placeholder="State / Province" />
            </div>
            <div className="signup-input-group half">
              <span className="input-icon"><FaMapMarkerAlt size={14} /></span>
              <input type="text" placeholder="City / District" />
            </div>
          </div>

          {/* Land Area */}
          <div className="signup-input-group">
            <span className="input-icon"><MdLandscape size={16} /></span>
            <input type="number" placeholder="Total Land Area (Acres)" />
          </div>

          {/* Mobile Number */}
          <div className="signup-input-group">
            <span className="input-icon"><FaMobileAlt size={16} /></span>
            <input type="tel" placeholder="Mobile Number" />
          </div>

          {/* OTP row */}
          <div className="signup-otp-row">
            <div className="signup-input-group otp-input">
              <span className="input-icon"><FaKey size={14} /></span>
              <input type="text" placeholder="Enter OTP" maxLength={6} />
            </div>
            <button className="otp-btn">Send OTP</button>
          </div>

          {/* Language Preference */}
          <div className="signup-row lang-row">
            <button className="lang-pref-btn">Language Preference</button>
            <div className="lang-radio-group">
              <label><input type="radio" name="lang" defaultChecked /> English</label>
              <span>|</span>
              <label><input type="radio" name="lang" /> Hindi</label>
              <span>|</span>
              <label><input type="radio" name="lang" /> ਪੰਜਾਬੀ</label>
            </div>
          </div>

          {/* Save Button */}
          <button className="signup-save-btn">Save Details</button>

          {/* Already have account */}
          <p className="signup-login-link">
            Already have an account?{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
              Log In
            </a>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Signup;