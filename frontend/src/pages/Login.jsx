/**
 * Login.jsx
 * ---------
 * Login page for SemantiCast.
 * Provides Google Sign-In using Firebase Authentication.
 * Uses DaisyUI components for a polished, modern look.
 */

import React, { useState } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Login() {
  const [error, setError] = useState(null);
  const [signingIn, setSigningIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleGoogleLogin = async () => {
    setError(null);
    setSigningIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to sign in with Google. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSigningIn(true);
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Email auth error:", err);
      const messages = {
        "auth/user-not-found": "No account found. Please sign up first.",
        "auth/wrong-password": "Incorrect password. Please try again.",
        "auth/email-already-in-use": "Email already in use. Try signing in.",
        "auth/weak-password": "Password must be at least 6 characters.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/invalid-credential": "Invalid email or password. Please try again.",
      };
      setError(messages[err.code] || "Authentication failed. Please try again.");
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      data-theme="corporate"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      {/* Main Login Card */}
      <div className="card w-full max-w-md bg-base-100 shadow-2xl">
        <div className="card-body items-center text-center gap-6">
          {/* Logo / Icon */}
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-16 h-16">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Application Title */}
          <div>
            <h1 className="text-3xl font-bold text-base-content">
              SemantiCast
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              ML-powered Image-to-Text Conversion
            </p>
          </div>

          {/* Divider */}
          <div className="divider my-0">{isSignUp ? "Create an account" : "Sign in to continue"}</div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input input-bordered w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="submit"
              disabled={signingIn}
              className="btn btn-primary btn-wide w-full normal-case text-base"
            >
              {signingIn ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                isSignUp ? "Sign Up" : "Sign In"
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <p className="text-sm text-base-content/60">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="link link-primary font-semibold"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          {/* OR Divider */}
          <div className="divider my-0">OR</div>

          {/* Google Sign-In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="btn btn-outline btn-wide gap-3 normal-case text-base"
          >
            {signingIn ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error shadow-sm w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Footer badges */}
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            <div className="badge badge-ghost badge-sm">Firebase Auth</div>
            <div className="badge badge-ghost badge-sm">Hugging Face</div>
            <div className="badge badge-ghost badge-sm">BLIP Model</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
