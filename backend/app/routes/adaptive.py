from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from ..database import get_db
from ..utils.security import get_current_user
from ..models.user import User
from ..models.question import Question
from ..models.adaptive_performance import AdaptivePerformance
from ..models.adaptive_quiz_session import AdaptiveQuizSession

router = APIRouter(prefix="/api/adaptive-quiz", tags=["adaptive"])
router_v1 = APIRouter(prefix="/api/v1/adaptive-quiz", tags=["adaptive-v1"])

DIFFICULTY_ORDER = ["Easy","Medium","Hard"]
def _next_diff(current: str, correct: bool, streak: int, accuracy: float, avg_time: float):
    idx = DIFFICULTY_ORDER.index(current) if current in DIFFICULTY_ORDER else 1
    if correct:
        # streak bonus: 3+ correct -> up, 5+ -> force up
        if streak >= 5 and idx < 2: return DIFFICULTY_ORDER[idx+1]
        if streak >= 3 and accuracy > 0.7 and idx < 2: return DIFFICULTY_ORDER[idx+1]
        if streak >= 2 and accuracy > 0.85 and avg_time < 45 and idx < 2: return DIFFICULTY_ORDER[idx+1]
        return current
    else:
        if streak == 0: # actually wrong_streak
            # if wrong streak >=2 -> down
            return current
        return current

def _calc_next(current: str, correct: bool, perf: AdaptivePerformance):
    # deterministic, avoid aggressive
    idx = DIFFICULTY_ORDER.index(current) if current in DIFFICULTY_ORDER else 1
    if correct:
        if perf.correct_streak >= 3:
            if idx < 2: return DIFFICULTY_ORDER[idx+1], f"Difficulty increased to {DIFFICULTY_ORDER[idx+1]} - {perf.correct_streak} correct in a row!"
        elif perf.correct_streak >= 2 and perf.accuracy > 0.75:
            if idx < 2: return DIFFICULTY_ORDER[idx+1], f"Great! Moving to {DIFFICULTY_ORDER[idx+1]} - strong accuracy {int(perf.accuracy*100)}%."
        return current, "Keep going - difficulty steady."
    else:
        if perf.wrong_streak >= 2:
            if idx > 0: return DIFFICULTY_ORDER[idx-1], f"Difficulty adjusted to {DIFFICULTY_ORDER[idx-1]} to help strengthen this topic."
        elif perf.wrong_streak >= 1 and perf.accuracy < 0.5:
            if idx > 0: return DIFFICULTY_ORDER[idx-1], f"Stepping down to {DIFFICULTY_ORDER[idx-1]} for better practice."
        return current, "Stay focused - same level."

def _get_perf(db: Session, user_id: int, subject: str="General", topic: str="General"):
    perf = db.query(AdaptivePerformance).filter(AdaptivePerformance.user_id==user_id, AdaptivePerformance.subject==subject).first()
    if not perf:
        perf = AdaptivePerformance(user_id=user_id, subject=subject, topic=topic, current_difficulty="Medium")
        db.add(perf); db.commit(); db.refresh(perf)
    return perf

def _pick_question(db: Session, difficulty: str, exclude: list):
    q = db.query(Question).filter(Question.difficulty.ilike(f"%{difficulty}%"))
    if exclude:
        q = q.filter(~Question.id.in_(exclude))
    res = q.order_by(Question.id).first()
    if not res:
        # fallback any not excluded
        res = db.query(Question).filter(~Question.id.in_(exclude) if exclude else True).first()
    return res

class StartIn(BaseModel):
    subject: Optional[str] = "General"
    topic: Optional[str] = None

class AnswerIn(BaseModel):
    question_id: int
    selected_answer: int
    time_taken: float = 0

def _session_out(s, perf):
    return {
        "quiz_id": s.id,
        "current_difficulty": s.current_difficulty,
        "recommended_next_difficulty": perf.current_difficulty,
        "accuracy": round(s.correct_count / s.total_count *100,1) if s.total_count else 0,
        "correct_count": s.correct_count,
        "total_count": s.total_count,
        "average_time": round(s.average_time,1),
        "streak": perf.correct_streak if perf.correct_streak else -perf.wrong_streak,
        "topic_performance": {"subject": perf.subject, "topic": perf.topic, "accuracy": round(perf.accuracy*100,1), "avg_time": round(perf.average_time,1)},
        "status": s.status,
        "questions_asked": s.questions_asked
    }

@router.post("/start")
@router_v1.post("/start")
def start(subject: str = "General", topic: Optional[str]=None, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    perf = _get_perf(db, current.id, subject, topic or "General")
    sess = AdaptiveQuizSession(user_id=current.id, current_difficulty=perf.current_difficulty, questions_asked=[], answers=[], correct_count=0, total_count=0)
    db.add(sess); db.commit(); db.refresh(sess)
    q = _pick_question(db, perf.current_difficulty, [])
    if not q: raise HTTPException(404, "No questions")
    sess.questions_asked = [q.id]; db.commit()
    return {"quiz_id": sess.id, "current_difficulty": sess.current_difficulty, "question": {"id": q.id, "text": q.text, "options": q.options, "subject": q.subject, "topic": q.topic, "difficulty": q.difficulty}, "perf": {"accuracy": round(perf.accuracy*100,1), "streak": perf.correct_streak - perf.wrong_streak}}

@router.post("/{quiz_id}/answer")
@router_v1.post("/{quiz_id}/answer")
def answer(quiz_id: int, data: AnswerIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    sess = db.query(AdaptiveQuizSession).filter(AdaptiveQuizSession.id==quiz_id, AdaptiveQuizSession.user_id==current.id).first()
    if not sess: raise HTTPException(404, "Session not found")
    if sess.status != "active": raise HTTPException(400, "Quiz already completed")
    q = db.query(Question).filter(Question.id==data.question_id).first()
    if not q: raise HTTPException(404, "Question not found")
    is_correct = (data.selected_answer == q.answer_idx)
    # update perf
    perf = _get_perf(db, current.id, q.subject, q.topic)
    perf.questions_attempted += 1
    # update time avg
    prev_total = perf.average_time * (perf.questions_attempted-1)
    perf.average_time = (prev_total + data.time_taken) / perf.questions_attempted if perf.questions_attempted else data.time_taken
    if is_correct:
        perf.correct_streak += 1
        perf.wrong_streak = 0
    else:
        perf.wrong_streak += 1
        perf.correct_streak = 0
    # accuracy = correct / attempted (we need to track correct)
    # approximate via streak? better store in perf.accuracy as moving
    # simple: accuracy = (prev_acc*(n-1) + (1 if correct else 0))/n
    prev_acc = perf.accuracy * (perf.questions_attempted-1) if perf.questions_attempted>1 else 0
    perf.accuracy = (prev_acc + (1 if is_correct else 0)) / perf.questions_attempted
    # decide next difficulty
    next_diff, msg = _calc_next(sess.current_difficulty, is_correct, perf)
    if next_diff != sess.current_difficulty:
        perf.current_difficulty = next_diff
        sess.current_difficulty = next_diff
    # update session
    sess.total_count += 1
    if is_correct: sess.correct_count += 1
    sess.average_time = (sess.average_time*(sess.total_count-1) + data.time_taken)/sess.total_count if sess.total_count else data.time_taken
    ans_list = sess.answers or []
    ans_list.append({"question_id": data.question_id, "selected": data.selected_answer, "correct": q.answer_idx, "is_correct": is_correct, "time_taken": data.time_taken})
    sess.answers = ans_list
    # pick next question with next_diff
    asked = sess.questions_asked or []
    next_q = _pick_question(db, next_diff, asked)
    if next_q:
        asked.append(next_q.id)
        sess.questions_asked = asked
    db.commit(); db.refresh(perf); db.refresh(sess)
    return {
        "is_correct": is_correct,
        "correct_answer": q.answer_idx,
        "explanation": q.explanation,
        "current_difficulty": sess.current_difficulty,
        "recommended_next_difficulty": next_diff,
        "message": msg,
        "next_question": {"id": next_q.id, "text": next_q.text, "options": next_q.options, "subject": next_q.subject, "topic": next_q.topic, "difficulty": next_q.difficulty} if next_q else None,
        "perf": {"accuracy": round(perf.accuracy*100,1), "streak": perf.correct_streak if is_correct else -perf.wrong_streak, "avg_time": round(perf.average_time,1)},
        "session": _session_out(sess, perf)
    }

@router.get("/{quiz_id}/status")
@router_v1.get("/{quiz_id}/status")
def status(quiz_id: int, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    sess = db.query(AdaptiveQuizSession).filter(AdaptiveQuizSession.id==quiz_id, AdaptiveQuizSession.user_id==current.id).first()
    if not sess: raise HTTPException(404, "Not found")
    perf = _get_perf(db, current.id)
    # if not completed, return next question
    next_q = None
    if sess.status=="active" and sess.questions_asked:
        last_id = sess.questions_asked[-1]
        # if last answer not yet given? we already gave next_q on answer, so status just returns sess
        pass
    return _session_out(sess, perf)

@router.post("/{quiz_id}/complete")
@router_v1.post("/{quiz_id}/complete")
def complete(quiz_id: int, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    sess = db.query(AdaptiveQuizSession).filter(AdaptiveQuizSession.id==quiz_id, AdaptiveQuizSession.user_id==current.id).first()
    if not sess: raise HTTPException(404, "Not found")
    sess.status = "completed"
    db.commit()
    perf = _get_perf(db, current.id)
    return _session_out(sess, perf)

@router.get("/performance")
@router_v1.get("/performance")
def perf_all(db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    rows = db.query(AdaptivePerformance).filter(AdaptivePerformance.user_id==current.id).all()
    if not rows:
        perf = _get_perf(db, current.id)
        rows = [perf]
    return [{"subject": r.subject, "topic": r.topic, "current_difficulty": r.current_difficulty, "accuracy": round(r.accuracy*100,1), "correct_streak": r.correct_streak, "wrong_streak": r.wrong_streak, "average_time": round(r.average_time,1), "questions_attempted": r.questions_attempted} for r in rows]
