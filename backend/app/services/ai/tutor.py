"""Tutor service - delegates to gemini_client."""
from .gemini_client import call_gemini
def ask_tutor(question: str, subject: str = "General"):
    return call_gemini(question, subject)
