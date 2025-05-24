import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase/firebase.config';
import { toast } from 'react-hot-toast';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Handle Firebase errors gracefully
  const handleError = (error, fallback = 'Authentication failed') => {
    console.error(error);
    if (error.code) {
      toast.error(error.code.replace('auth/', '').replaceAll('-', ' '));
    } else {
      toast.error(fallback);
    }
  };

  // Register
  const createUser = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL || `https://ui-avatars.com/api/?name=${name}&background=random`
      });
      setUser(userCredential.user);
      toast.success('Account created successfully!');
      return userCredential.user;
    } catch (error) {
      handleError(error, 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Login
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      toast.success('Logged in successfully!');
      return userCredential.user;
    } catch (error) {
      handleError(error, 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
      toast.success('Google login successful!');
      return result.user;
    } catch (error) {
      handleError(error, 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  // GitHub Sign In
  const githubSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      setUser(result.user);
      toast.success('GitHub login successful!');
      return result.user;
    } catch (error) {
      handleError(error, 'GitHub login failed');
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      handleError(error, 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleSignIn,
    githubSignIn,
    logOut
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
