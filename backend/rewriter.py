from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def optimize_resume(resume_text: str, missing_keywords: list) -> str:
    prompt = f"""
    You are a professional Resume Writer. 
    The user is missing the following keywords: {missing_keywords}.
    
    Rewrite the "Experience" or "Skills" section of the resume below to 
    truthfully incorporate these keywords. Do not invent experiences, 
    but highlight relevant aspects that might imply these skills.
    
    Resume:
    {resume_text}
    
    Return the rewritten sections in Markdown format.
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        content = response.choices[0].message.content
        return content if content else "Could not generate optimization suggestion."
    except Exception as e:
        print(f"Error during optimization: {e}")
        return f"Error: {str(e)}"
