"""Question generator - uses Gemini prompt if key present, else mock."""
from ...config import settings
PROMPT_PATH = "app/prompts/question_generation.txt"
def generate_questions(topic: str, count: int = 5):
    if settings.GEMINI_API_KEY:
        from .gemini_client import call_gemini
        # TODO: load prompt and call
        return []
    return [{"text": f"Mock Q on {topic}", "options": ["A","B","C","D"], "answer_idx": 0, "explanation": "Mock"}]
