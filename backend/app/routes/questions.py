from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models.question import Question
from ..utils.security import get_current_user_optional

router = APIRouter(prefix="/api/questions", tags=["questions"])

def _sanitize(q: Question) -> dict:
    # SECURITY FIX: strip answer_idx / explanation from public reads
    return {"id": q.id, "subject": q.subject, "topic": q.topic, "difficulty": q.difficulty, "text": q.text, "options": q.options}

@router.get("")
def list_questions(subject: Optional[str] = None, topic: Optional[str] = None, limit: int = Query(20, le=50), db: Session = Depends(get_db)):
    q = db.query(Question)
    if subject:
        q = q.filter(Question.subject.ilike(f"%{subject}%"))
    if topic:
        q = q.filter(Question.topic.ilike(f"%{topic}%"))
    rows = q.limit(limit).all()
    return [_sanitize(r) for r in rows]

@router.get("/{qid}")
def get_question(qid: int, db: Session = Depends(get_db)):
    qq = db.query(Question).filter(Question.id == qid).first()
    if not qq:
        raise HTTPException(404, "Question not found")
    return _sanitize(qq)

@router.post("/{qid}/verify")
def verify_answer(qid: int, payload: dict, db: Session = Depends(get_db)):
    """Verify a single answer - returns correctness + explanation only after submission (no pre-leak)."""
    qq = db.query(Question).filter(Question.id == qid).first()
    if not qq:
        raise HTTPException(404, "Question not found")
    selected = payload.get("selected_idx")
    if selected is None:
        raise HTTPException(400, "selected_idx required")
    is_correct = (selected == qq.answer_idx)
    return {"question_id": qid, "is_correct": is_correct, "correct_idx": qq.answer_idx, "correct_option": qq.options[qq.answer_idx] if 0 <= qq.answer_idx < len(qq.options) else None, "explanation": qq.explanation}
