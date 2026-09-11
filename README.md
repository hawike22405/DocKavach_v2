# DocKavach_v2: National Identity Screening Workspace

DocKavach is a comprehensive, AI-powered document screening platform designed for authorized officers. It utilizes Optical Character Recognition (OCR), computer vision, and rule-based validation to extract and verify information from official documents such as Passports, Visas, and National IDs.

---

## 🛠 Why This Tech Stack? (Technologies & Advantages)

DocKavach is built using a modern, decoupled architecture to ensure high performance, maintainability, and seamless AI integration.

### Frontend: Next.js, React, Tailwind CSS, & Zustand
*   **Next.js & React:** Provides rapid rendering and a robust App Router. It allows us to build a highly interactive, single-page application feel while maintaining excellent performance.
*   **Tailwind CSS:** Enables rapid, highly customizable UI development without leaving the HTML/JSX. It ensures the dashboard remains clean, responsive, and easy to maintain.
*   **Zustand:** A lightweight, boilerplate-free state manager. It is perfectly suited for tracking the complex, multi-step states required during a live screening session (Capture -> Processing -> Results).

### Backend: Python & Flask
*   **Python:** The undisputed industry standard for AI, Machine Learning, and Computer Vision. Using Python natively allows us to integrate deep learning models without brittle cross-language bridges.
*   **Flask:** Provides a lightweight, un-opinionated web framework. Instead of a heavy MVC framework, Flask acts as the perfect, minimal REST API wrapper around our complex AI scripts.

### AI & Computer Vision: PaddleOCR, PyMuPDF, OpenCV
*   **PaddleOCR:** Vastly outperforms traditional engines (like Tesseract) in reading complex, dense document layouts and varied fonts found on international IDs.
*   **PyMuPDF & python-docx:** Enables the system to natively ingest, parse, and render multi-page PDFs and Word documents directly into images for the OCR pipeline without requiring external system dependencies like Poppler.
*   **OpenCV:** Efficiently handles low-level image manipulation, bounding box rendering, and face cropping for tampering detection.

### Database: MongoDB
*   **NoSQL Flexibility:** The AI modules generate highly variable, deeply nested JSON results (e.g., a Passport yields entirely different fields than a National ID). MongoDB stores these documents natively, completely eliminating the need for rigid SQL schemas and constant database migrations.

---

## ⚙️ How It Works (Project Architecture)

DocKavach follows a linear, highly explainable workflow:

1.  **Capture & Upload (UI):** The officer captures a live face photo via webcam and uploads document evidence. The UI supports single images, multiple images, PDFs, and Word documents.
2.  **Collage Merging (Backend):** The Flask backend intercepts the payload. If multiple documents or multi-page PDFs are uploaded, it uses PyMuPDF to extract them and seamlessly stitches them vertically into one single, continuous image.
3.  **AI Pipeline (Backend):** The merged image passes through four core modules:
    *   **Module 1 (OCR):** Extracts Machine Readable Zone (MRZ) data and parses textual fields.
    *   **Module 2 (Face Match):** Compares the live webcam photo against the face detected on the ID card.
    *   **Module 3 (Tampering):** Analyzes the image for visual anomalies (e.g., digital photo replacement).
    *   **Module 4 (Validation):** A rules engine verifies logic (e.g., checking if the expiry date has passed).
4.  **Risk Scoring:** The system aggregates the module results, computes an overall risk score, and generates a preliminary recommendation.
5.  **Officer Review:** The officer reviews the explainable results on the frontend dashboard and records a final, audited decision (Approve / Flag / Reject) which is saved securely to MongoDB.

---

## 🚀 Local Setup Instructions

Follow these steps to run both the backend and frontend on your individual computer.

### Prerequisites
*   Python 3.12+
*   Node.js 18+
*   MongoDB database (Local or MongoDB Atlas URL)

### 1. Backend Setup (API & AI Models)
Open a terminal, navigate to the root directory of the project, and run the following commands:

```bash
# Create a virtual environment
python -m venv .venv

# Activate the virtual environment
# On Windows:
.\.venv\Scripts\activate
# On Mac/Linux:
# source .venv/bin/activate

# Install the required Python packages
pip install -r requirements.txt

# Start the Flask development server
python app.py
```
*The backend will now be running on `http://127.0.0.1:5000`.*

> **Note:** Ensure your `.env` file is present in the root directory containing `MONGO_URI`, `JWT_SECRET`, etc., before starting the server.

### 2. Frontend Setup (User Interface)
Open a **new, separate terminal window** (leave the backend running), and run the following commands:

```bash
# Navigate to the frontend folder
cd frontend

# Install the Node.js dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The frontend will now be running on `http://localhost:3000`.*

---

## Disclaimer
> **Security Note:** This repository may contain sensitive configuration files (like `.env`) for demonstration or private deployment purposes. Do not expose this repository publicly without rotating the credentials.
