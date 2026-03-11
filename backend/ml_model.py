"""
ml_model.py
-----------
Machine Learning module for SemantiCast.
Uses the BLIP image captioning model from Hugging Face Transformers
to generate text descriptions from images.
"""

from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

# Global variables to hold the model and processor (loaded once)
_processor = None
_model = None


def load_model():
    """
    Load the BLIP image captioning model and processor.
    Uses 'Salesforce/blip-image-captioning-base' from Hugging Face.
    The model is loaded only once and cached in global variables
    for efficient reuse across multiple requests.
    """
    global _processor, _model

    if _processor is None or _model is None:
        print("Loading BLIP image captioning model... This may take a moment on first run.")
        _processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
        _model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
        print("Model loaded successfully.")

    return _processor, _model


def generate_caption(image: Image.Image) -> str:
    """
    Generate a text caption for the given image using the BLIP model.

    Args:
        image (PIL.Image.Image): The input image to caption.

    Returns:
        str: The generated caption describing the image content.
    """
    # Load model (uses cached version if already loaded)
    processor, model = load_model()

    # Convert image to RGB if it has an alpha channel or is in a different mode
    if image.mode != "RGB":
        image = image.convert("RGB")

    # Resize large images to avoid memory issues (max 1024px on longest side)
    max_size = 1024
    if max(image.size) > max_size:
        image.thumbnail((max_size, max_size), Image.LANCZOS)

    # Preprocess the image for the model (unconditional captioning - image only)
    inputs = processor(images=image, return_tensors="pt")

    # Generate caption using the model
    output = model.generate(**inputs, max_new_tokens=100)

    # Decode the generated tokens into a human-readable string
    caption = processor.decode(output[0], skip_special_tokens=True)

    return caption
