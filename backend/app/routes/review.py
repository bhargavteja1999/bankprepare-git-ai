from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from ..database import get_db
from ..models.review_item import ReviewItem
from ..models.question import Question
from ..utils.security import get_current_user

router = APIRouter(prefix="/api/review", tags=["review"])

# SM-2 simplified
def sm2_update(item: ReviewItem, quality: int):
    # quality 0-5 (5 perfect)
    if quality < 3:
        item.repetitions = 0
        item.interval = 1
    else:
        if item.repetitions == 0:
            item.interval = 1
        elif item.repetitions == 1:
            item.interval = 6
        else:
            item.interval = int(item.interval * item.ease)
        item.repetitions += 1
    item.ease = max(1.3, item.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
    item.due_date = datetime.utcnow() + timedelta(days=item.interval)
    item.last_reviewed = datetime.utcnow()

@router.post("/add/{question_id}")
def add_review(question_id: int, db: Session = Depends(get_db), current = Depends(get_current_user)):
    existing = db.query(ReviewItem).filter(ReviewItem.user_id==current.id, ReviewItem.question_id==question_id).first()
    if existing:
        return existing
    item = ReviewItem(user_id=current.id, question_id=question_id, due_date=datetime.utcnow())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item

@router.get("/due")
def due_reviews(limit: int = 20, db: Session = Depends(get_db), current = Depends(get_current_user)):
    now = datetime.utcnow()
    items = db.query(ReviewItem).filter(ReviewItem.user_id==current.id, ReviewItem.due_date <= now).limit(limit).all()
    # hydrate questions
    qids = [i.question_id for i in items]
    qs = {q.id: q for q in db.query(Question).filter(Question.id.in_(qids)).all()} if qids else {}
    return [{"review_id": i.id, "due_date": i.due_date, "interval": i.interval, "ease": i.ease, "question": {"id": qs[i.question_id].id, "text": qs[i.question_id].text, "options": qs[i.question_id].options, "subject": qs[i.question_id].subject} if i.question_id in qs else None} for i in items]

@router.post("/{review_id}/grade")
def grade(review_id: int, quality: int = 4, db: Session = Depends(get_db), current = Depends(get_current_user)):
    item = db.query(ReviewItem).filter(ReviewItem.id==review_id, ReviewItem.user_id==current.id).first()
    if not item:
        from fastapi import HTTPException; raise HTTPException(404, "Review not found")
    sm2_update(item, quality)
    db.commit()
    return {"message": "graded", "interval": item.interval, "ease": round(item.ease,2), "due_date": item.due_date}
