"""
main.py
-------
FastAPI backend server for SemantiCast.
Provides a REST API endpoint for image captioning using the BLIP ML model.
Handles CORS for frontend requests and validates uploaded images.
"""

import io
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from dotenv import load_dotenv

from ml_model import generate_caption, load_model

# Load environment variables from .env file
load_dotenv()

# Initialize FastAPI application
app = FastAPI(
    title="SemantiCast API",
    description="Image-to-text captioning API using BLIP model",
    version="1.0.0"
)

# Configure CORS to allow requests from the React frontend
# In production, replace the wildcard with your frontend's actual URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Allowed image file types
ALLOWED_EXTENSIONS = {"image/jpeg", "image/png", "image/jpg", "image/webp", "image/bmp"}


@app.on_event("startup")
async def startup_event():
    """
    Pre-load the ML model when the server starts.
    This avoids a long delay on the first API request.
    """
    print("Pre-loading BLIP model on server startup...")
    load_model()
    print("Server is ready to accept requests.")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "SemantiCast API is running", "status": "ok"}


@app.post("/caption-image")
async def caption_image(file: UploadFile = File(...)):
    """
    Accept an uploaded image and return an AI-generated caption.

    Args:
        file: The uploaded image file.

    Returns:
        JSON with the generated caption text.

    Example response:
        {"caption": "A flooded street with two people standing near damaged buildings."}
    """
    # Validate that a file was uploaded
    if not file:
        raise HTTPException(status_code=400, detail="No image file provided.")

    # Validate the file type
    if file.content_type not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type: {file.content_type}. Allowed types: JPEG, PNG, WebP, BMP."
        )

    try:
        # Read the uploaded file into memory
        contents = await file.read()

        # Open the image using Pillow
        image = Image.open(io.BytesIO(contents))

        # Generate the caption using the BLIP ML model
        caption = generate_caption(image)

        return {"caption": caption}

    except Exception as e:
        # Handle any errors during image processing or model inference
        raise HTTPException(
            status_code=500,
            detail=f"Error processing image: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    # Run the server on port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
