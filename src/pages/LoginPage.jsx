import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup, resetPassword } from '../services/Auth'; // Import resetPassword from Auth service
import '../styles/loginpage.css';  // Import the CSS file for styling

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false); // State for displaying reset password form
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email || !password || (isSignup && !confirmPassword)) {
      setError('All fields are required');
      return false;
    }
    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleAuth = async () => {
    if (!validateForm()) return;

    try {
      if (isSignup) {
        await signup(email, password);
        alert('Signup successful!');
      } else {
        await login(email, password);
        alert('Login successful!');
      }
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async () => {
    try {
      await resetPassword(email);
      alert('Password reset link sent to your email.');
      setShowResetPassword(false); // Hide the reset password form after successful email sending
    } catch (error) {
      setError('Error sending password reset email: ' + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? 'Signup' : 'Login'}</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <div className="user-box">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Email</label>
      </div>
      
      <div className="user-box">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label>Password</label>
      </div>
      
      {isSignup && (
        <div className="user-box">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label>Confirm Password</label>
        </div>
      )}

      {/* Button to trigger login/signup */}
      <button onClick={handleAuth}>
        {isSignup ? 'Sign up' : 'Log in'}
      </button>
      
      <button className="toggle-btn" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account?' : 'New user? Signup'}
      </button>

      {/* Forgot Password link */}
      {!isSignup && !showResetPassword && (
        <button className="toggle-btn" onClick={() => setShowResetPassword(true)}>
          Forgot Password?
        </button>
      )}
      
      {/* Reset Password Form */}
      {showResetPassword && (
        <div className="reset-password-form">
          <h3>Reset Your Password</h3>
          <p>Enter your email to receive a password reset link.</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handlePasswordReset}>Send Reset Link</button>
          <button onClick={() => setShowResetPassword(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
