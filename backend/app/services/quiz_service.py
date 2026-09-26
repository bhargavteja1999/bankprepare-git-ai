"""Quiz service - fetch helpers (thin wrapper; logic stays in routes for now)."""
from sqlalchemy.orm import Session
from ..models.quiz import Quiz
from ..models.question import Question

def get_quiz_with_questions(db: Session, quiz_id: int):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz: return None, []
    qids = quiz.question_ids or []
    qs = db.query(Question).filter(Question.id.in_(qids)).all()
    # preserve order
    qmap = {q.id: q for q in qs}
    ordered = [qmap[i] for i in qids if i in qmap]
    return quiz, ordered
