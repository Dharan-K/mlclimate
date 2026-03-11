/**
 * App.jsx
 * -------
 * Main application component with routing.
 * Handles authentication state and protects the Dashboard route.
 * Uses React Router for navigation between Login and Dashboard pages.
 */

import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  // Track the currently authenticated user
  const [user, setUser] = useState(null);
  // Track whether we're still checking auth state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for Firebase auth state changes (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  // Show a loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Login page – redirect to dashboard if already authenticated */}
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <Login />}
        />

        {/* Protected dashboard – redirect to login if not authenticated */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
