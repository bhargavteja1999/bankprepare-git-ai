from pydantic import BaseModel
from typing import List

class QuestionOut(BaseModel):
    id: int
    subject: str
    topic: str
    difficulty: str
    text: str
    options: List[str]
    answer_idx: int
    explanation: str | None = None
    class Config:
        from_attributes = True

class QuestionCreate(BaseModel):
    subject: str
    topic: str
    difficulty: str = "medium"
    text: str
    options: List[str]
    answer_idx: int
    explanation: str | None = None
