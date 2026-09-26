from pydantic import BaseModel
from typing import Optional

class TutorIn(BaseModel):
    question: str
    subject: Optional[str] = "General"

class TutorOut(BaseModel):
    answer: str
    subject: str
    source: str
    hint: Optional[str] = None
