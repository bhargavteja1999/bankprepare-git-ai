from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.bookmark import Bookmark
from ..models.question import Question
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/bookmarks", tags=["bookmarks"])

@router.post("/{question_id}")
def toggle(question_id: int, note: str = "", db: Session = Depends(get_db), current = Depends(get_current_user)):
    q = db.query(Question).filter(Question.id==question_id).first()
    if not q:
        raise HTTPException(404, "Question not found")
    existing = db.query(Bookmark).filter(Bookmark.user_id==current.id, Bookmark.question_id==question_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return {"bookmarked": False}
    bm = Bookmark(user_id=current.id, question_id=question_id, note=note)
    db.add(bm)
    db.commit()
    return {"bookmarked": True, "id": bm.id}

@router.get("")
def list_bookmarks(db: Session = Depends(get_db), current = Depends(get_current_user)):
    bms = db.query(Bookmark).filter(Bookmark.user_id==current.id).all()
    qids = [b.question_id for b in bms]
    qs = {q.id: q for q in db.query(Question).filter(Question.id.in_(qids)).all()} if qids else {}
    return [{"id": b.id, "note": b.note, "question": {"id": qs[b.question_id].id, "text": qs[b.question_id].text, "options": qs[b.question_id].options} if b.question_id in qs else None} for b in bms]
