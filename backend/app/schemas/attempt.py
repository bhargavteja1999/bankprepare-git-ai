from pydantic import BaseModel
from typing import List

class AttemptOut(BaseModel):
    score: int
    total: int
    accuracy: int
    xp_earned: int
    correct_map: List[int]
    feedback: str
