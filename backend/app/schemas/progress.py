from pydantic import BaseModel
from typing import List

class ProgressOut(BaseModel):
    syllabus_covered: int
    questions_solved: int
    accuracy: int
    streak: int
    xp: int
    weak_topics: List[str]
    rank: int | None = 342
