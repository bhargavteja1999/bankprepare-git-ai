from fastapi import APIRouter, Depends
from pydantic import BaseModel
from datetime import date, timedelta
from typing import Optional
from sqlalchemy.orm import Session
from ..database import get_db
from ..utils.security import get_current_user_optional
from ..models.study_plan import StudyPlan
import json

router = APIRouter(prefix="/api/study-plan", tags=["study-plan"])

class PlanIn(BaseModel):
    target_exam: str = "IBPS PO"
    exam_date: str  # YYYY-MM-DD
    daily_hours: int = 3
    weak_topics: Optional[list] = None

@router.post("/generate")
def generate_plan(data: PlanIn, db: Session = Depends(get_db), current = Depends(get_current_user_optional)):
    try:
        exam_d = date.fromisoformat(data.exam_date)
    except:
        exam_d = date.today() + timedelta(days=60)
    days_left = (exam_d - date.today()).days
    days_left = max(7, days_left)
    # simple AI-like distribution
    phases = []
    if days_left <= 30:
        phases = [{"phase": "Revision + Mocks", "days": days_left, "focus": "Full syllabus + daily mock", "hours_per_day": data.daily_hours}]
    else:
        phases = [
            {"phase": "Foundation", "days": days_left//3, "focus": "Quants basics + Reasoning puzzles", "hours_per_day": data.daily_hours},
            {"phase": "Intermediate", "days": days_left//3, "focus": "Weak topics + sectional tests", "hours_per_day": data.daily_hours},
            {"phase": "Advance + Mocks", "days": days_left - 2*(days_left//3), "focus": f"Full mocks for {data.target_exam}", "hours_per_day": data.daily_hours},
        ]
    # daily breakdown mock
    plan = {"target_exam": data.target_exam, "exam_date": str(exam_d), "days_left": days_left, "phases": phases, "daily_tasks": [{"day": i+1, "date": str(date.today()+timedelta(days=i)), "task": f"Day {i+1}: {phases[min(i//(days_left//3), len(phases)-1)]['focus']}", "topics": data.weak_topics or ["Simplification", "Puzzles"]} for i in range(min(7, days_left))], "note": "Gemini would personalize this - set GEMINI_API_KEY for live generation"}
    if current:
        sp = StudyPlan(user_id=current.id, plan=plan)
        db.add(sp)
        db.commit()
    return plan

@router.get("")
def get_plan(db: Session = Depends(get_db), current = Depends(get_current_user_optional)):
    if current:
        last = db.query(StudyPlan).filter(StudyPlan.user_id==current.id).order_by(StudyPlan.created_at.desc()).first()
        if last:
            return last.plan
    return {"message": "No plan yet - POST /api/study-plan/generate"}
