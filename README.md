# MarkItDown Studio

MarkItDown Studio is a professional web-based file conversion application based on the [Microsoft MarkItDown](https://github.com/microsoft/markitdown) Python library. It features an "Antigravity-inspired" dark theme, glassmorphism, and a modern drag-and-drop interface.

## Features

- **Drag & Drop Upload:** Seamlessly upload multiple files.
- **Batch Conversion:** Convert files individually or merge them into a single Markdown document.
- **Real-time Preview:** View the generated Markdown inside the application.
- **Copy & Download:** Easily copy the output or download it as `.md` files.
- **Supported Formats:** PDF, DOCX, PPTX, XLSX, CSV, HTML, TXT, JSON (and any other format natively supported by `markitdown`).

## Tech Stack

**Backend:**
- Python 3.10+
- FastAPI & Uvicorn
- Microsoft `markitdown`
- `python-multipart` (for file handling)

**Frontend:**
- React 18+
- Vite
- Vanilla CSS (Antigravity aesthetic)
- `lucide-react` (Icons)
- `framer-motion` (Animations)
- `react-markdown` (Preview)

---

## Local Setup

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://localhost:8000`.

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables (copy `.env.example` to `.env`):
   ```bash
   cp .env.example .env
   ```
   Ensure `VITE_API_BASE_URL` points to your running backend (e.g., `http://localhost:8000`).
4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`.

---

## Deployment Guidelines

### Backend (Render or Railway)
The backend is ready to be deployed to PaaS providers like Render or Railway.
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** Automatically defined by the included `Procfile` (`uvicorn main:app --host 0.0.0.0 --port $PORT`).
- **Environment Variables:**
  - `MAX_FILE_SIZE_MB`: Max size for a single file (default: 25).
  - `MAX_TOTAL_UPLOAD_MB`: Max total size for batch uploads (default: 100).
  - `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend URLs (e.g., `https://your-frontend.vercel.app`).

### Frontend (Vercel)
The frontend is built with Vite and is Vercel-ready.
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_BASE_URL`: The URL of your deployed backend (e.g., `https://your-backend.onrender.com`).

---

## Constraints & Notes
- **Image Processing:** Image conversion (OCR) is only supported locally if the native MarkItDown prerequisites (like `pdf2image`, `tesseract`) are installed on your server environment. Version 1 does not configure external API-based OCR (like OpenAI).
- **File Upload Limits:** Both the backend and frontend are configured with file size limits to prevent server overload. Adjust these via `.env`.
