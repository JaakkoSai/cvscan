from openai import OpenAI
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def optimize_resume(resume_text: str, missing_keywords: list, hiring_company_name: str = "the target company", target_country: str = "International", user_feedback: str = None) -> dict:
    feedback_instruction = ""
    if user_feedback:
        feedback_instruction = f"""
        7.  **USER FEEDBACK (CRITICAL)**: The user has reviewed a previous version and provided this specific feedback: "{user_feedback}".
            - You MUST prioritize this feedback above all else.
            - If they say they don't know a skill, REMOVE IT.
            - If they want to emphasize something, rewrite to highlight it.
        """

    prompt = f"""
    You are a professional Executive Resume Writer. 
    
    Goal: Rewrite this resume to land a job at **{hiring_company_name}** in **{target_country}**.
    
    Instructions:
    1.  **Format for {target_country}**: Apply resume norms for {target_country}.
        - If {target_country} is in Europe/Scandinavia: It is often common to have a "Profile" or "Summary" first, followed by Experience. Ensure the layout is clean.
        - If {target_country} is USA: Experience usually comes first for experienced hires.
        - **Reorder Sections**: Move the most relevant sections to the top for this specific role and country.
    2.  **Tailor the Objective/Summary**: If the resume mentions applying to a DIFFERENT company (e.g. "Seeking a role at Nokia"), YOU MUST CHANGE IT to "{hiring_company_name}" or a generic professional statement.
    3.  **Integrate Missing Keywords**: The candidate is missing: {missing_keywords}. Rewrite bullet points to naturally include these skills.
    4.  **Consolidate Skills**: Do NOT have both a "Core Competencies" and "Technical Skills" section if they repeat the same content. Merge them into one strong "Technical Skills" or "Core Competencies" section.
    5.  **Upgrade "Interests" / "Self Learning"**: If the resume has an Interests or Self Learning section, update it to include technologies relevant to {hiring_company_name} (e.g. if they use Azure, mention "Learning Azure Cloud Architecture").
    6.  **Impact-Driven**: Do not just stuff keywords. Rewrite weak bullet points to be results-oriented (e.g. "Used Python" -> "Leveraged Python to automate workflows, saving 10 hours/week").
    {feedback_instruction}
    8.  **Full Rewrite**: Return the **ENTIRE** resume text with your improvements. Make it shine!
    
    Resume:
    {resume_text}
    
    Output JSON format:
    {{
        "rewritten_text": "The FULL resume text with improvements"
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
            result = json.loads(content)
            # We now expect 'rewritten_text' to be the full text
            # We pass it as 'full_modified_text' to match our frontend logic
            full_text = result.get("rewritten_text", "")
            
            return {
                "original_text": resume_text, # Pass original for reference if needed
                "rewritten_text": full_text,  # This is now the full text
                "full_modified_text": full_text 
            }
        return {"error": "No response from AI"}
    except Exception as e:
        print(f"Error during optimization: {e}")
        return {"error": str(e)}
