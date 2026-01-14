# Jobscan Clone

This is a full-stack Jobscan clone application.

## Prerequisites
- Python 3.8+
- Node.js & npm (Required for frontend)
- OpenAI API Key

## Setup & Running

### 1. Backend
Navigate to the `backend` directory:
```bash
cd backend
```

Create a virtual environment (optional but recommended):
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in `backend/` and add your API key:
```
OPENAI_API_KEY=sk-your-key-here
```

Run the server:
```bash
uvicorn main:app --reload
```
The API will be available at `http://localhost:8000`.

### 2. Frontend
Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173` (or similar).

## Usage
1. Open the frontend in your browser.
2. Upload a Resume (PDF or DOCX).
3. Paste the Job Description.
4. Click "Scan Resume".
5. View the match score and AI optimization suggestions.
