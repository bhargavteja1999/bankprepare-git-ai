from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.quiz import Quiz
from ..models.question import Question
from ..models.attempt import Attempt
from ..schemas.quiz import QuizSubmitIn
from ..utils.security import get_current_user, get_current_user_optional
from ..utils.scoring import calculate_score
from ..models.mistake_notebook import MistakeNotebook

router = APIRouter(prefix="/api/quizzes", tags=["quizzes"])

@router.get("")
def list_quizzes(db: Session = Depends(get_db)):
    return db.query(Quiz).all()

@router.get("/{quiz_id}")
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    qids = quiz.question_ids or []
    qs = db.query(Question).filter(Question.id.in_(qids)).all()
    # SECURITY: never leak answer_idx / explanation on GET - only on POST /submit
    return {"id": quiz.id, "title": quiz.title, "subject": quiz.subject, "duration_min": quiz.duration_min, "difficulty": quiz.difficulty, "questions": [{"id": q.id, "subject": q.subject, "topic": q.topic, "difficulty": q.difficulty, "text": q.text, "options": q.options} for q in qs]}

@router.post("/submit")
def submit_quiz(payload: QuizSubmitIn, db: Session = Depends(get_db), current = Depends(get_current_user_optional)):
    quiz = db.query(Quiz).filter(Quiz.id == payload.quiz_id).first()
    if not quiz:
        raise HTTPException(404, "Quiz not found")
    qids = quiz.question_ids or []
    qs = db.query(Question).filter(Question.id.in_(qids)).all()
    # keep order as stored
    q_map = {q.id: q for q in qs}
    ordered_qs = [q_map[i] for i in qids if i in q_map]
    dict_qs = [{"answer_idx": q.answer_idx} for q in ordered_qs]
    result = calculate_score(payload.answers, dict_qs)
    result["correct_map"] = [q.answer_idx for q in ordered_qs]
    result["feedback"] = "Great job!" if result["accuracy"] >= 70 else "Keep practicing weak areas."
    # persist attempt if logged in + auto-save mistakes
    if current:
        attempt = Attempt(user_id=current.id, quiz_id=quiz.id, answers=payload.answers, score=result["score"], total=result["total"], accuracy=result["accuracy"], xp_earned=result["xp_earned"])
        db.add(attempt)
        for i, ans in enumerate(payload.answers):
            if i >= len(ordered_qs): break
            q = ordered_qs[i]
            time_spent = 0
            if hasattr(payload, "time_spent") and payload.time_spent and i < len(payload.time_spent):
                try: time_spent = float(payload.time_spent[i])
                except: time_spent = 0
            is_correct = (ans == q.answer_idx)
            if not is_correct and ans is not None and ans != -1:
                existing = db.query(MistakeNotebook).filter(MistakeNotebook.user_id==current.id, MistakeNotebook.question_id==q.id).first()
                if existing:
                    existing.mistake_count += 1
                    existing.selected_answer = ans
                    existing.is_reviewed = False
                    existing.time_taken = time_spent
                else:
                    db.add(MistakeNotebook(user_id=current.id, question_id=q.id, selected_answer=ans, correct_answer=q.answer_idx, mistake_count=1, time_taken=time_spent))
        db.commit()
    return result
