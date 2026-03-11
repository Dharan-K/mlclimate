# SemantiCast Prototype

**ML-powered Image-to-Text Conversion with Google Authentication**

SemantiCast is a minimal full-stack web application that demonstrates Machine Learning based image-to-text conversion combined with Google authentication using Firebase.

---

## Features

- **Google Sign-In** via Firebase Authentication
- **Protected Dashboard** accessible only after login
- **Image Upload** with drag-and-drop support
- **ML Image Captioning** using Hugging Face BLIP model
- **Real-time Caption Display** on the dashboard

---

## Tech Stack

| Layer          | Technology                              |
| -------------- | --------------------------------------- |
| Frontend       | React + Vite, TailwindCSS              |
| Authentication | Firebase Authentication (Google)        |
| Backend        | Python FastAPI                          |
| Machine Learning | Hugging Face Transformers, BLIP model |
| Image Processing | Pillow                                |

---

## Project Structure

```
semanticast/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ImageUpload.jsx      # Reusable image upload component
│   │   ├── pages/
│   │   │   ├── Login.jsx            # Google sign-in page
│   │   │   └── Dashboard.jsx        # Protected dashboard with ML features
│   │   ├── firebase.js              # Firebase configuration
│   │   ├── App.jsx                  # Main app with routing & auth state
│   │   ├── main.jsx                 # React entry point
│   │   └── index.css                # TailwindCSS imports
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                         # Frontend environment variables
│   └── .env.example
│
├── backend/
│   ├── main.py                      # FastAPI server with /caption-image endpoint
│   ├── ml_model.py                  # BLIP model loading and caption generation
│   ├── requirements.txt             # Python dependencies
│   └── .env.example
│
└── README.md
```

---

## Prerequisites

- **Node.js** (v18 or later) and **npm**
- **Python** (v3.9 or later) and **pip**
- **Git** (optional)

---

## Setup Instructions

### 1. Clone / Extract the Project

If you received this as a zip file, extract it. Otherwise:

```bash
cd d:\mlclim\semanticast
```

---

### 2. Backend Setup

#### a. Navigate to the backend directory

```bash
cd backend
```

#### b. Create a Python virtual environment (recommended)

```bash
python -m venv venv
```

#### c. Activate the virtual environment

**Windows (PowerShell):**
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```cmd
venv\Scripts\activate.bat
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

> **Troubleshooting:**
> - **"Python was not found"** → Python is not installed. Download and install it from [python.org](https://www.python.org/downloads/). During installation, **check "Add Python to PATH"**.
> - **"cannot be loaded because running scripts is disabled"** → Run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in PowerShell first, then activate the venv again.

#### d. Install Python dependencies

```bash
pip install -r requirements.txt
```

> **Note:** The first install will download the BLIP model (~1GB). This only happens once.

#### e. Run the backend server

```bash
python main.py
```

The backend will start at: **http://localhost:8000**

The BLIP ML model will be pre-loaded on startup (first run downloads the model).

---

### 3. Frontend Setup

#### a. Navigate to the frontend directory

Open a **new terminal** and run:

```bash
cd d:\mlclim\semanticast\frontend
```

#### b. Install Node.js dependencies

```bash
npm install
```

#### c. Start the development server

```bash
npm run dev
```

The frontend will start at: **http://localhost:5173**

---

### 4. Firebase Configuration

The Firebase configuration is already embedded in the project for the `mlclim` project. No additional setup is needed.

**If you want to use your own Firebase project:**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Google Sign-In** under Authentication → Sign-in method
4. Copy your Firebase config and replace the values in `frontend/src/firebase.js`

**Important:** Make sure Google Sign-In is enabled in your Firebase project:
- Firebase Console → Authentication → Sign-in method → Google → Enable

---

## How to Use

1. Open **http://localhost:5173** in your browser
2. Click **"Sign in with Google"**
3. Authenticate with your Google account
4. You'll be redirected to the **Dashboard**
5. Upload an image (drag-and-drop or click to browse)
6. Click **"Convert Image to Text"**
7. Wait for the ML model to process the image
8. The generated caption will be displayed below

---

## API Endpoint

### POST `/caption-image`

Accepts an uploaded image and returns an AI-generated caption.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "caption": "A flooded street with two people standing near damaged buildings."
}
```

**Error Response:**
```json
{
  "detail": "Invalid file type: text/plain. Allowed types: JPEG, PNG, WebP, BMP."
}
```

---

## Environment Variables

### Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:8000
```

### Backend (`backend/.env.example`)

```
HOST=0.0.0.0
PORT=8000
```

---

## Application Workflow

```
User → Login Page → Google Sign-In → Firebase Auth → Dashboard
                                                        ↓
                                                  Upload Image
                                                        ↓
                                              Click "Convert Image to Text"
                                                        ↓
                                              Frontend sends image to API
                                                        ↓
                                              Backend runs BLIP model
                                                        ↓
                                              Returns generated caption
                                                        ↓
                                              Dashboard displays caption
```

---

## Troubleshooting

| Issue | Solution |
|-------|---------|
| Google Sign-In popup blocked | Allow popups for localhost in your browser |
| CORS error | Ensure the backend is running on port 8000 |
| Model download slow | First run downloads ~1GB model; subsequent runs use cache |
| Port already in use | Kill the process or change the port in config |
| Firebase auth error | Ensure Google Sign-In is enabled in Firebase Console |

---

## License

This is a prototype for educational and demonstration purposes.
