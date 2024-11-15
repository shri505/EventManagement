import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, signup, resetPassword } from '../services/Auth'; // Import auth services for login, signup, and reset password
import '../styles/loginpage.css';  // Import the CSS file for styling

const LoginPage = () => {
  // State hooks for managing form data, errors, and visibility of forms
  const [email, setEmail] = useState('');               // Email input state
  const [password, setPassword] = useState('');         // Password input state
  const [confirmPassword, setConfirmPassword] = useState('');  // Confirm password state (for signup)
  const [isSignup, setIsSignup] = useState(false);      // Flag to toggle between login and signup forms
  const [error, setError] = useState('');               // Error message state
  const [showResetPassword, setShowResetPassword] = useState(false);  // State to control the visibility of the password reset form
  const navigate = useNavigate();  // Hook for programmatic navigation (to redirect after login/signup)

  // Function to validate form input before submitting
  const validateForm = () => {
    if (!email || !password || (isSignup && !confirmPassword)) {
      setError('All fields are required');  // Show error if any field is empty
      return false;
    }
    if (isSignup && password !== confirmPassword) {
      setError('Passwords do not match');  // Show error if passwords do not match
      return false;
    }
    setError('');  // Reset error if form is valid
    return true;
  };

  // Function to handle login/signup
  const handleAuth = async () => {
    if (!validateForm()) return;  // If the form is not valid, do not proceed

    try {
      if (isSignup) {
        await signup(email, password);  // Call signup function if isSignup is true
        alert('Signup successful!');     // Show success message
      } else {
        await login(email, password);   // Call login function if isSignup is false
        alert('Login successful!');      // Show success message
      }
      navigate('/');  // Navigate to the home page (or any other page) after successful login/signup
    } catch (error) {
      setError(error.message);  // If an error occurs, display it
    }
  };

  // Function to handle password reset
  const handlePasswordReset = async () => {
    try {
      await resetPassword(email);  // Call the reset password function
      alert('Password reset link sent to your email.');  // Show success message
      setShowResetPassword(false);  // Hide the reset password form after sending the email
    } catch (error) {
      setError('Error sending password reset email: ' + error.message);  // Show error if resetting password fails
    }
  };

  return (
    <div className="login-container">
      <h2>{isSignup ? 'Signup' : 'Login'}</h2>
      
      {/* Display error message if any */}
      {error && <p className="error-message">{error}</p>}
      
      {/* Email input field */}
      <div className="user-box">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}  // Update email state on change
          required
        />
        <label>Email</label>
      </div>
      
      {/* Password input field */}
      <div className="user-box">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}  // Update password state on change
          required
        />
        <label>Password</label>
      </div>
      
      {/* Confirm Password input field (only visible on signup) */}
      {isSignup && (
        <div className="user-box">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}  // Update confirmPassword state on change
            required
          />
          <label>Confirm Password</label>
        </div>
      )}

      {/* Button to trigger login or signup */}
      <button onClick={handleAuth}>
        {isSignup ? 'Sign up' : 'Log in'}  {/* Change button text based on the form type */}
      </button>
      
      {/* Toggle button to switch between login and signup forms */}
      <button className="toggle-btn" onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? 'Already have an account?' : 'New user? Signup'}
      </button>

      {/* Forgot Password link (only visible on login form) */}
      {!isSignup && !showResetPassword && (
        <button className="toggle-btn" onClick={() => setShowResetPassword(true)}>
          Forgot Password?
        </button>
      )}
      
      {/* Reset Password Form (only visible when showResetPassword is true) */}
      {showResetPassword && (
        <div className="reset-password-form">
          <h3>Reset Your Password</h3>
          <p>Enter your email to receive a password reset link.</p>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}  // Update email state on change
          />
          <button onClick={handlePasswordReset}>Send Reset Link</button>  {/* Send reset link */}
          <button onClick={() => setShowResetPassword(false)}>Cancel</button>  {/* Close reset form */}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
