from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.exam import Exam

router = APIRouter(prefix="/api/exams", tags=["exams"])

@router.get("")
def list_exams(db: Session = Depends(get_db)):
    return db.query(Exam).all()

@router.get("/{exam_id}")
def get_exam(exam_id: int, db: Session = Depends(get_db)):
    exam = db.query(Exam).filter(Exam.id == exam_id).first()
    if not exam:
        raise HTTPException(404, "Exam not found")
    return exam
