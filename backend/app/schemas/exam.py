from pydantic import BaseModel
from typing import List

class ExamOut(BaseModel):
    id: int
    name: str
    code: str
    subjects: List[str]
    duration_min: int
    total_questions: int
    class Config:
        from_attributes = True
