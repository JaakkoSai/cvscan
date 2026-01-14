from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from parser import extract_text_from_pdf, extract_text_from_docx
from analyzer import analyze_match
from rewriter import optimize_resume
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev simplicity
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_cv(
    file: UploadFile = File(...), 
    job_description: str = Form(...)
):
    # 1. Parse File
    filename = file.filename if file.filename else ""
    content = await file.read()
    file_stream = io.BytesIO(content)
    
    resume_text = ""
    if filename.lower().endswith(".pdf"):
        resume_text = extract_text_from_pdf(file_stream)
    elif filename.lower().endswith(".docx"):
        resume_text = extract_text_from_docx(file_stream)
    else:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")

    if not resume_text or len(resume_text.strip()) == 0:
        raise HTTPException(status_code=400, detail="Could not extract text from the file.")

    # 2. Analyze
    analysis = analyze_match(resume_text, job_description)
    
    if "error" in analysis:
        # If it's a critical error we might want to return 500, but for now just pass it
        pass

    # 3. Optimize (Optional: Only if score is low or missing keywords exist)
    optimization_suggestion = ""
    missing_keywords = analysis.get('missing_keywords', [])
    if missing_keywords:
        optimization_suggestion = optimize_resume(resume_text, missing_keywords)

    return {
        "text": resume_text,
        "analysis": analysis,
        "optimization": optimization_suggestion
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
