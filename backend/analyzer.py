from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_match(resume_text: str, job_description: str) -> dict:
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) scanner. 
    
    1. Extract the **Hiring Company Name** from the Job Description (if not explicitly stated, infer it or say "Unknown").
    2. Extract the **Target Country** for the role (e.g. "Finland", "USA", "Remote"). If not stated, infer from the location or language. Default to "International".
    3. Extract top 10 hard skills/keywords from the Job Description.
    4. Check if these keywords exist in the Resume.
    5. Calculate a match score (0-100).
    6. Provide a list of missing keywords.

    Job Description:
    {job_description}

    Resume:
    {resume_text}

    Output JSON format:
    {{
        "hiring_company_name": "Name or Unknown",
        "target_country": "Country Name",
        "match_score": 75,
        "found_keywords": ["python", "sql"],
        "missing_keywords": ["aws", "docker"],
        "summary": "Good match but missing cloud skills."
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-5.2",
            messages=[{"role": "user", "content": prompt}],
            response_format={ "type": "json_object" }
        )
        content = response.choices[0].message.content
        if content:
            return json.loads(content)
        else:
            return {"error": "No response from AI"}
    except Exception as e:
        print(f"Error during analysis: {e}")
        return {"error": str(e)}
