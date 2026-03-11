/**
 * Dashboard.jsx
 * -------------
 * Protected dashboard page for SemantiCast.
 * Uses DaisyUI components for a polished, modern interface.
 * Displays user info, provides image upload, and sends images
 * to the backend ML API for caption generation.
 */

import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import ImageUpload from "../components/ImageUpload";

// Backend API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Dashboard({ user }) {
  // State for the selected image file and its preview URL
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // State for the ML-generated caption
  const [caption, setCaption] = useState("");

  // Loading state while the ML model processes the image
  const [loading, setLoading] = useState(false);

  // Error state for API call failures
  const [error, setError] = useState(null);

  /**
   * Handle user logout via Firebase.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  /**
   * Handle image selection from the upload component.
   */
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setCaption("");
    setError(null);

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(null);
    }
  };

  /**
   * Send the selected image to the backend API for captioning.
   */
  const handleConvert = async () => {
    if (!selectedImage) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setCaption("");
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);

      const response = await fetch(`${API_URL}/caption-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to process image.");
      }

      const data = await response.json();
      setCaption(data.caption);
    } catch (err) {
      console.error("Caption error:", err);
      setError(err.message || "An error occurred while processing the image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200" data-theme="corporate">
      {/* ─── Navbar ─── */}
      <div className="navbar bg-base-100 shadow-md px-4 lg:px-8">
        <div className="flex-1">
          <a className="text-xl font-bold text-primary normal-case">
            SemantiCast
          </a>
          <div className="badge badge-primary badge-outline ml-2 hidden sm:flex">
            Prototype
          </div>
        </div>

        <div className="flex-none gap-3">
          {/* User info - visible on larger screens */}
          <div className="text-right hidden md:block">
            <p className="text-sm font-semibold">{user.displayName}</p>
            <p className="text-xs text-base-content/50">{user.email}</p>
          </div>

          {/* User avatar dropdown */}
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  alt="User avatar"
                  src={
                    user.photoURL ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      user.displayName || "U"
                    )}&background=6366f1&color=fff`
                  }
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow-lg bg-base-100 rounded-box w-56"
            >
              <li className="menu-title px-4 py-2">
                <span className="text-xs text-base-content/50">
                  {user.email}
                </span>
              </li>
              <li>
                <a onClick={handleLogout} className="text-error">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Welcome Card */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-12">
                  <span className="text-lg">
                    {(user.displayName || "U").charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="card-title text-lg">
                  Welcome back, {user.displayName || "User"}!
                </h2>
                <p className="text-sm text-base-content/60">
                  Upload an image and use AI to generate a text description.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Steps indicator ─── */}
        <ul className="steps steps-horizontal w-full text-xs">
          <li className={`step ${selectedImage ? "step-primary" : ""}`}>
            Upload Image
          </li>
          <li className={`step ${loading ? "step-primary" : caption ? "step-primary" : ""}`}>
            Analyze with AI
          </li>
          <li className={`step ${caption ? "step-primary" : ""}`}>
            View Caption
          </li>
        </ul>

        {/* ─── Upload Card ─── */}
        <div className="card bg-base-100 shadow-md">
          <div className="card-body">
            <h3 className="card-title text-base gap-2">
              <svg
                className="w-5 h-5 text-primary"
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
              Upload Image
            </h3>

            {/* Image upload component */}
            <ImageUpload onImageSelect={handleImageSelect} />

            {/* Image preview */}
            {imagePreview && (
              <div className="mt-4">
                <div className="text-sm font-medium text-base-content/70 mb-2">
                  Preview
                </div>
                <figure className="rounded-xl overflow-hidden border border-base-300 bg-base-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-w-full max-h-80 mx-auto object-contain"
                  />
                </figure>
              </div>
            )}

            {/* Convert button */}
            <div className="card-actions mt-4">
              <button
                onClick={handleConvert}
                disabled={!selectedImage || loading}
                className="btn btn-primary btn-block gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Processing... ML model is analyzing the image
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Convert Image to Text
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ─── Error Alert ─── */}
        {error && (
          <div className="alert alert-error shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
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
            <div>
              <h3 className="font-bold text-sm">Error</h3>
              <div className="text-xs">{error}</div>
            </div>
          </div>
        )}

        {/* ─── Caption Result Card ─── */}
        {caption && (
          <div className="card bg-base-100 shadow-md border-l-4 border-success">
            <div className="card-body">
              <h3 className="card-title text-base gap-2">
                <svg
                  className="w-5 h-5 text-success"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Generated Caption
              </h3>
              <div className="bg-success/10 rounded-lg p-4 mt-2">
                <p className="text-base-content text-base leading-relaxed italic">
                  "{caption}"
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="badge badge-success badge-outline badge-sm">
                  BLIP Model
                </div>
                <div className="badge badge-ghost badge-sm">AI Generated</div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer className="footer footer-center p-6 text-base-content/40 text-xs">
        <div>
          <p>
            SemantiCast Prototype &bull; Firebase Auth &bull; BLIP Image
            Captioning &bull; Hugging Face Transformers
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
