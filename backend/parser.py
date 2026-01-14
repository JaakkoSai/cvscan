from pypdf import PdfReader
from docx import Document
import io

def extract_text_from_pdf(file_stream) -> str:
    """Extracts text from a PDF file stream."""
    try:
        reader = PdfReader(file_stream)
        text = ""
        for page in reader.pages:
            result = page.extract_text()
            if result:
                text += result + "\n"
        return text
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def extract_text_from_docx(file_stream) -> str:
    """Extracts text from a DOCX file stream."""
    try:
        doc = Document(file_stream)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        print(f"Error reading DOCX: {e}")
        return ""
