import os
from ...config import settings

def call_gemini(prompt: str, subject: str = "General") -> str:
    api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY not set")
    # Placeholder: integrate google-generativeai here
    # import google.generativeai as genai
    # genai.configure(api_key=api_key)
    # model = genai.GenerativeModel("gemini-1.5-flash")
    # resp = model.generate_content(prompt)
    # return resp.text
    return f"[Gemini mock] Answer for '{prompt}' in {subject} - configure real SDK with key."
