/**
 * ImageUpload.jsx
 * ---------------
 * Reusable image upload component for SemantiCast.
 * Uses DaisyUI styling for a polished drag-and-drop upload area.
 * Validates file types before passing the selected file to the parent component.
 */

import React, { useRef, useState } from "react";

// Accepted image file types
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/bmp"];

function ImageUpload({ onImageSelect }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");

  /**
   * Validate and handle the selected file.
   */
  const handleFile = (file) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Invalid file type. Please upload a JPEG, PNG, WebP, or BMP image.");
      return;
    }

    setFileName(file.name);
    onImageSelect(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/jpeg,image/png,image/jpg,image/webp,image/bmp"
        className="hidden"
      />

      {/* Drop zone / click area — DaisyUI styled */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer 
          transition-all duration-200 hover:shadow-md
          ${
            dragOver
              ? "border-primary bg-primary/5 shadow-md"
              : "border-base-300 hover:border-primary/50 hover:bg-base-200/50"
          }`}
      >
        {/* Upload icon */}
        <div className="flex flex-col items-center gap-3">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors
              ${dragOver ? "bg-primary/20" : "bg-base-200"}`}
          >
            <svg
              className={`w-7 h-7 transition-colors ${
                dragOver ? "text-primary" : "text-base-content/40"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>

          {fileName ? (
            <div className="space-y-1">
              <p className="text-sm font-semibold text-primary">{fileName}</p>
              <p className="text-xs text-base-content/50">
                Click or drop to replace
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              <p className="text-sm font-medium text-base-content/70">
                <span className="text-primary font-semibold">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
              <p className="text-xs text-base-content/40">
                JPEG, PNG, WebP, or BMP (max 10MB)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
