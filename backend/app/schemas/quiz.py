from pydantic import BaseModel
from typing import List, Optional

class QuizOut(BaseModel):
    id: int
    title: str
    subject: str
    duration_min: int
    difficulty: str
    question_ids: List[int] | None = None
    class Config:
        from_attributes = True

class QuizDetailOut(QuizOut):
    questions: List[dict]

class QuizSubmitIn(BaseModel):
    quiz_id: int = 1
    answers: List[int]
    time_spent: Optional[List[float]] = None
