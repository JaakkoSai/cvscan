from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def analyze_match(resume_text: str, job_description: str) -> dict:
    prompt = f"""
    You are an expert ATS (Applicant Tracking System) scanner. 
    
    1. Extract top 10 hard skills/keywords from the Job Description.
    2. Check if these keywords exist in the Resume.
    3. Calculate a match score (0-100).
    4. Provide a list of missing keywords.

    Job Description:
    {job_description}

    Resume:
    {resume_text}

    Output JSON format:
    {{
        "match_score": 75,
        "found_keywords": ["python", "sql"],
        "missing_keywords": ["aws", "docker"],
        "summary": "Good match but missing cloud skills."
    }}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
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
