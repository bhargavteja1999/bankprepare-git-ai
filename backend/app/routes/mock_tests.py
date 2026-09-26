from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.quiz import Quiz
from ..models.question import Question
from ..models.attempt import Attempt
from ..utils.security import get_current_user_optional
from ..utils.scoring import calculate_score
import random

router = APIRouter(prefix="/api/mock-tests", tags=["mock-tests"])

@router.get("")
def list_mocks(db: Session = Depends(get_db)):
    # reuse quizzes as mocks with extra metadata
    qs = db.query(Quiz).all()
    return [{"id": q.id, "title": q.title, "subject": q.subject, "duration_min": q.duration_min, "questions": len(q.question_ids or []), "type": "sectional" if q.subject != "Full Mock" else "full", "negative_marking": 0.25} for q in qs]

@router.post("/{mock_id}/start")
def start_mock(mock_id: int, db: Session = Depends(get_db), current = Depends(get_current_user_optional)):
    quiz = db.query(Quiz).filter(Quiz.id == mock_id).first()
    if not quiz:
        raise HTTPException(404, "Mock not found")
    qids = quiz.question_ids or []
    qs = db.query(Question).filter(Question.id.in_(qids)).all()
    random.shuffle(qs)
    # return without answers for test
    sanitized = [{"id": q.id, "subject": q.subject, "topic": q.topic, "text": q.text, "options": q.options} for q in qs]
    return {"mock_id": mock_id, "title": quiz.title, "duration_min": quiz.duration_min, "questions": sanitized, "instructions": "1 mark per Q, -0.25 negative. Sectional timer 20 min."}

@router.post("/{mock_id}/submit")
def submit_mock(mock_id: int, payload: dict, db: Session = Depends(get_db), current = Depends(get_current_user_optional)):
    # payload: {answers: [idx,...], time_taken_sec: int}
    answers = payload.get("answers", [])
    quiz = db.query(Quiz).filter(Quiz.id == mock_id).first()
    if not quiz:
        raise HTTPException(404, "Mock not found")
    qids = quiz.question_ids or []
    qs = db.query(Question).filter(Question.id.in_(qids)).all()
    qmap = {q.id: q for q in qs}
    ordered = [qmap[i] for i in qids if i in qmap]
    # scoring with negative
    score = 0
    for i, ans in enumerate(answers):
        if i >= len(ordered):
            break
        if ans == ordered[i].answer_idx:
            score += 1
        elif ans is not None and ans != -1:
            score -= 0.25
    score = round(score, 2)
    accuracy = round(max(0, score) / len(ordered) * 100) if ordered else 0
    xp = int(max(0, score) * 10)
    # section-wise
    sections = {}
    for i, q in enumerate(ordered):
        sec = q.subject
        sections.setdefault(sec, {"score": 0, "total": 0})
        sections[sec]["total"] += 1
        if i < len(answers) and answers[i] == q.answer_idx:
            sections[sec]["score"] += 1
    if current:
        attempt = Attempt(user_id=current.id, quiz_id=mock_id, answers=answers, score=int(score), total=len(ordered), accuracy=accuracy, xp_earned=xp)
        db.add(attempt)
        db.commit()
    return {"mock_id": mock_id, "score": score, "total": len(ordered), "accuracy": accuracy, "xp_earned": xp, "sections": sections, "correct_map": [q.answer_idx for q in ordered], "rank_prediction": "Top 15%" if accuracy > 75 else "Needs improvement"}
