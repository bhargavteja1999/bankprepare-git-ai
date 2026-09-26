from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel
from ..database import get_db
from ..utils.security import get_current_user
from ..models.user import User
from ..models.mistake_notebook import MistakeNotebook
from ..models.question import Question

router = APIRouter(prefix="/api/mistakes", tags=["mistakes"])
router_v1 = APIRouter(prefix="/api/v1/mistakes", tags=["mistakes-v1"])

class MistakeNoteUpdate(BaseModel):
    personal_note: Optional[str] = None
    is_reviewed: Optional[bool] = None
    is_important: Optional[bool] = None
    is_fixed: Optional[bool] = None

def _to_out(m, q):
    return {
        "id": m.id,
        "question_id": m.question_id,
        "question": {"id": q.id, "text": q.text, "options": q.options, "answer_idx": q.answer_idx, "explanation": q.explanation, "subject": q.subject, "topic": q.topic, "difficulty": q.difficulty} if q else None,
        "selected_answer": m.selected_answer,
        "correct_answer": m.correct_answer,
        "mistake_count": m.mistake_count,
        "personal_note": m.personal_note,
        "is_reviewed": m.is_reviewed,
        "is_important": m.is_important,
        "is_fixed": m.is_fixed,
        "time_taken": m.time_taken,
        "last_reviewed_at": m.last_reviewed_at,
        "created_at": m.created_at,
        "subject": q.subject if q else None,
        "topic": q.topic if q else None,
        "difficulty": q.difficulty if q else None,
    }

def _list_logic(db: Session, user: User, subject: Optional[str]=None, topic: Optional[str]=None, difficulty: Optional[str]=None, reviewed: Optional[bool]=None, important: Optional[bool]=None, search: Optional[str]=None):
    q = db.query(MistakeNotebook, Question).join(Question, MistakeNotebook.question_id==Question.id).filter(MistakeNotebook.user_id==user.id)
    if subject: q = q.filter(Question.subject.ilike(f"%{subject}%"))
    if topic: q = q.filter(Question.topic.ilike(f"%{topic}%"))
    if difficulty: q = q.filter(Question.difficulty==difficulty)
    if reviewed is not None: q = q.filter(MistakeNotebook.is_reviewed==reviewed)
    if important is not None: q = q.filter(MistakeNotebook.is_important==important)
    if search: q = q.filter(Question.text.ilike(f"%{search}%"))
    rows = q.order_by(MistakeNotebook.updated_at.desc()).all()
    return [_to_out(m, qq) for m, qq in rows]

@router.post("/from-attempt")
@router_v1.post("/from-attempt")
def add_from_attempt(question_id: int, selected_answer: int, time_taken: float = 0, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    q = db.query(Question).filter(Question.id==question_id).first()
    if not q: raise HTTPException(404, "Question not found")
    if selected_answer == q.answer_idx:
        raise HTTPException(400, "Correct answer not a mistake")
    existing = db.query(MistakeNotebook).filter(MistakeNotebook.user_id==current.id, MistakeNotebook.question_id==question_id).first()
    if existing:
        existing.mistake_count += 1
        existing.selected_answer = selected_answer
        existing.time_taken = time_taken
        existing.is_reviewed = False
        db.commit()
        db.refresh(existing)
        return _to_out(existing, q)
    m = MistakeNotebook(user_id=current.id, question_id=question_id, selected_answer=selected_answer, correct_answer=q.answer_idx, mistake_count=1, time_taken=time_taken)
    db.add(m); db.commit(); db.refresh(m)
    return _to_out(m, q)

@router.get("")
@router_v1.get("")
def list_mistakes(subject: Optional[str]=None, topic: Optional[str]=None, difficulty: Optional[str]=None, reviewed: Optional[bool]=None, important: Optional[bool]=None, search: Optional[str]=None, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    return _list_logic(db, current, subject, topic, difficulty, reviewed, important, search)

@router.get("/stats")
@router_v1.get("/stats")
def stats(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    all_rows = db.query(MistakeNotebook).filter(MistakeNotebook.user_id==current.id).all()
    total = len(all_rows)
    unreviewed = len([x for x in all_rows if not x.is_reviewed])
    important = len([x for x in all_rows if x.is_important])
    frequently = len([x for x in all_rows if x.mistake_count>=3])
    # recently added last 7 days
    from datetime import datetime, timedelta
    recent = len([x for x in all_rows if x.created_at and x.created_at >= datetime.utcnow() - timedelta(days=7)])
    by_subject = {}
    for m in all_rows:
        q = db.query(Question).filter(Question.id==m.question_id).first()
        subj = q.subject if q else "Unknown"
        by_subject[subj] = by_subject.get(subj,0)+1
    return {"total": total, "unreviewed": unreviewed, "important": important, "frequently_wrong": frequently, "recently_added": recent, "by_subject": by_subject}

@router.patch("/{mid}")
@router_v1.patch("/{mid}")
def update_mistake(mid: int, data: MistakeNoteUpdate, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    m = db.query(MistakeNotebook).filter(MistakeNotebook.id==mid, MistakeNotebook.user_id==current.id).first()
    if not m: raise HTTPException(404, "Mistake not found")
    if data.personal_note is not None: m.personal_note = data.personal_note
    if data.is_reviewed is not None: 
        m.is_reviewed = data.is_reviewed
        if data.is_reviewed:
            from datetime import datetime
            m.last_reviewed_at = datetime.utcnow()
    if data.is_important is not None: m.is_important = data.is_important
    if data.is_fixed is not None: m.is_fixed = data.is_fixed
    db.commit(); db.refresh(m)
    q = db.query(Question).filter(Question.id==m.question_id).first()
    return _to_out(m,q)

@router.delete("/{mid}")
@router_v1.delete("/{mid}")
def delete_mistake(mid: int, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    m = db.query(MistakeNotebook).filter(MistakeNotebook.id==mid, MistakeNotebook.user_id==current.id).first()
    if not m: raise HTTPException(404, "Mistake not found")
    db.delete(m); db.commit()
    return {"message": "Deleted"}

@router.post("/practice-quiz")
@router_v1.post("/practice-quiz")
def practice_quiz(limit: int = 10, subject: Optional[str]=None, difficulty: Optional[str]=None, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    # build quiz from mistakes
    q = db.query(MistakeNotebook, Question).join(Question, MistakeNotebook.question_id==Question.id).filter(MistakeNotebook.user_id==current.id)
    if subject: q = q.filter(Question.subject.ilike(f"%{subject}%"))
    if difficulty: q = q.filter(Question.difficulty==difficulty)
    rows = q.order_by(MistakeNotebook.mistake_count.desc()).limit(limit).all()
    if not rows: raise HTTPException(404, "No mistakes to practice")
    questions = [{"id": qq.id, "text": qq.text, "options": qq.options, "subject": qq.subject, "topic": qq.topic, "difficulty": qq.difficulty, "mistake_id": m.id, "mistake_count": m.mistake_count} for m, qq in rows]
    return {"title": f"Mistake Practice - {len(questions)} Qs", "questions": questions}

# also mount without prefix for backward compat: /api/mistake-notebook
mistake_notebook_router = APIRouter(prefix="/api/mistake-notebook", tags=["mistake-notebook"])
@mistake_notebook_router.get("")
def list_notebook_compat(subject: Optional[str]=None, topic: Optional[str]=None, difficulty: Optional[str]=None, reviewed: Optional[bool]=None, important: Optional[bool]=None, search: Optional[str]=None, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    return _list_logic(db, current, subject, topic, difficulty, reviewed, important, search)
