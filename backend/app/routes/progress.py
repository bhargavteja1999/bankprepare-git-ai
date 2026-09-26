from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..utils.security import get_current_user, get_current_user_optional
from ..models.progress import Progress
from ..models.user import User

router = APIRouter(prefix="/api", tags=["progress"])

@router.get("/progress")
def get_progress(db: Session = Depends(get_db), current = Depends(get_current_user_optional)):
    if current:
        prog = db.query(Progress).filter(Progress.user_id == current.id).first()
        if prog:
            return {"user": current.email, "syllabus_covered": prog.syllabus_covered, "questions_solved": prog.questions_solved, "accuracy": prog.accuracy, "streak": prog.streak, "xp": prog.xp, "weak_topics": prog.weak_topics or [], "rank": 342}
    # fallback demo
    return {"user": "demo@bankprepare.ai", "syllabus_covered": 68, "questions_solved": 1240, "accuracy": 74, "streak": 12, "xp": 4850, "weak_topics": ["Data Interpretation (52%)", "Error Spotting (48%)", "Blood Relations (60%)"], "rank": 342}

@router.get("/leaderboard")
def leaderboard():
    return [{"rank": 1, "name": "Aarav S.", "xp": 8920}, {"rank": 2, "name": "Priya K.", "xp": 8450}, {"rank": 342, "name": "You", "xp": 4850, "is_you": True}]
