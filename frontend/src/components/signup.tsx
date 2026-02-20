import { useState } from "react";
import { FaUser, FaMapMarkerAlt, FaMobileAlt, FaKey } from "react-icons/fa";
import { MdLandscape } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, firebaseReady } from "../lib/firebase";
import "./signup.css";

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [city, setCity] = useState("");
  const [landArea, setLandArea] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSendOtp = () => {
    if (!mobile.trim()) {
      setMessage("Enter mobile number before requesting OTP.");
      return;
    }
    setMessage("OTP sent (demo flow). Use any 6 digits to continue.");
  };

  const handleSignup = async () => {
    if (!firebaseReady || !auth) {
      setMessage("Firebase is not configured. Add VITE_FIREBASE_* values in frontend/.env.local.");
      return;
    }

    if (!fullName || !email || !password) {
      setMessage("Full name, email, and password are required.");
      return;
    }

    if (!otp || otp.length < 4) {
      setMessage("Please enter OTP to continue.");
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(credential.user, {
        displayName: fullName,
      });
      navigate('/smart-advisory');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

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
            <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          </div>

          {/* Address */}
          <div className="signup-input-group">
            <span className="input-icon"><FaMapMarkerAlt size={16} /></span>
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>

          {/* State + City row */}
          <div className="signup-row">
            <div className="signup-input-group half">
              <span className="input-icon"><FaMapMarkerAlt size={14} /></span>
              <input type="text" placeholder="State / Province" value={stateValue} onChange={(e) => setStateValue(e.target.value)} />
            </div>
            <div className="signup-input-group half">
              <span className="input-icon"><FaMapMarkerAlt size={14} /></span>
              <input type="text" placeholder="City / District" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
          </div>

          {/* Land Area */}
          <div className="signup-input-group">
            <span className="input-icon"><MdLandscape size={16} /></span>
            <input type="number" placeholder="Total Land Area (Acres)" value={landArea} onChange={(e) => setLandArea(e.target.value)} />
          </div>

          {/* Mobile Number */}
          <div className="signup-input-group">
            <span className="input-icon"><FaMobileAlt size={16} /></span>
            <input type="tel" placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>

          <div className="signup-input-group">
            <span className="input-icon"><FaUser size={16} /></span>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="signup-input-group">
            <span className="input-icon"><FaKey size={16} /></span>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {/* OTP row */}
          <div className="signup-otp-row">
            <div className="signup-input-group otp-input">
              <span className="input-icon"><FaKey size={14} /></span>
              <input type="text" placeholder="Enter OTP" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            <button className="otp-btn" onClick={handleSendOtp}>Send OTP</button>
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
          <button className="signup-save-btn" onClick={() => void handleSignup()} disabled={loading}>
            {loading ? 'Saving...' : 'Save Details'}
          </button>

          {message && <p className="signup-login-link">{message}</p>}

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