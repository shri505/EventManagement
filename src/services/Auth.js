// src/services/Auth.js
import { auth } from '../firebase'; // Firebase auth instance
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

// Login function
export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Signup function
export const signup = async (email, password) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

// Password Reset function
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email); // Send password reset link to email
  } catch (error) {
    throw new Error(error.message); // Throw error if sending reset fails
  }
};

// Get current user
export const getCurrentUser = () => {
  const user = auth.currentUser;
  return user ? { name: user.displayName, email: user.email } : null;
};
