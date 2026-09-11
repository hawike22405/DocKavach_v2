# DocKavach_v2

DocKavach is a comprehensive document screening and verification platform that utilizes OCR (Optical Character Recognition) to extract and validate information from official documents such as Passports, Visas, and National IDs.

## Features
- **OCR Extraction**: Powered by PaddleOCR for robust text extraction.
- **MRZ Parsing**: Automatically detects and parses Machine Readable Zones on Passports.
- **Heuristic Extraction**: Extracts key fields (Name, Document Number, DOB, Expiry) from non-MRZ documents.
- **Secure Backend**: Built with Flask, MongoDB, and JWT authentication.
- **Modern Frontend**: Built with Next.js and Tailwind CSS.

## Setup Instructions

### Prerequisites
- Python 3.9+
- Node.js 18+
- MongoDB Database (Local or MongoDB Atlas)

### Backend Setup
1. Ensure the `.env` file is present in the root directory. It contains all necessary environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `PORT`, `HOST`, etc.
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask backend:
   ```bash
   python app.py
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the Next.js development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/screening/upload` - Upload and process document images
- `GET /api/health` - Backend health check

## Disclaimer
> **Note**: This repository contains sensitive configuration files (`.env`) for demonstration purposes and is intended to be kept private. Do not expose this repository publicly without rotating the credentials.
