from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import date, timedelta, datetime
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..utils.security import get_current_user, get_current_user_optional
from ..models.user import User
from ..models.tournament import Tournament
from ..models.tournament_question import TournamentQuestion
from ..models.tournament_attempt import TournamentAttempt
from ..models.question import Question
from ..config import settings
import random

router = APIRouter(prefix="/api/tournaments", tags=["tournaments"])
router_v1 = APIRouter(prefix="/api/v1/tournaments", tags=["tournaments-v1"])
weekly_router = APIRouter(prefix="/api/weekly-tournament", tags=["weekly-tournament"])

# Configurable rewards
REWARDS = {1: 1000, 2: 750, 3: 500, "top10": 250, "participation": 50}
BADGES = {1: "Weekly Champion", 2: "Top 10", 3: "Speed Master", 4: "Accuracy Master", 5: "Tournament Regular"}

def _ensure_weekly(db: Session):
    today = date.today()
    # start on Monday
    monday = today - timedelta(days=today.weekday())
    sunday = monday + timedelta(days=6)
    t = db.query(Tournament).filter(Tournament.start_date==monday, Tournament.end_date==sunday).first()
    if t: return t
    t = Tournament(title=f"Weekly Tournament - {monday.isoformat()} to {sunday.isoformat()}", description="50 Qs: Quants(15)+Reasoning(15)+English(10)+GA/Banking(10)", start_date=monday, end_date=sunday, duration_minutes=60, total_questions=50, status="active")
    db.add(t); db.commit(); db.refresh(t)
    # pick 50 questions balanced
    all_qs = db.query(Question).all()
    # group
    groups = {"Quants": [], "Reasoning": [], "English": [], "General": []}
    for q in all_qs:
        if q.subject.lower().startswith("quant"): groups["Quants"].append(q)
        elif q.subject.lower().startswith("reason"): groups["Reasoning"].append(q)
        elif q.subject.lower().startswith("english"): groups["English"].append(q)
        else: groups["General"].append(q)
    picks = []
    picks += random.sample(groups["Quants"], min(15, len(groups["Quants"]))) if groups["Quants"] else []
    picks += random.sample(groups["Reasoning"], min(15, len(groups["Reasoning"]))) if groups["Reasoning"] else []
    picks += random.sample(groups["English"], min(10, len(groups["English"]))) if groups["English"] else []
    picks += random.sample(groups["General"], min(10, len(groups["General"]))) if groups["General"] else []
    # if not enough, fill random
    while len(picks) < 50 and len(all_qs)>len(picks):
        extra = random.choice(all_qs)
        if extra not in picks: picks.append(extra)
    random.shuffle(picks)
    for idx, q in enumerate(picks[:50]):
        db.add(TournamentQuestion(tournament_id=t.id, question_id=q.id, question_order=idx))
    db.commit()
    return t

def _score_payload(answers: List[Optional[int]], questions: List[Question], time_taken: float):
    correct=wrong=unanswered=0
    score=0
    for i, q in enumerate(questions):
        ans = answers[i] if i < len(answers) else None
        if ans is None or ans == -1:
            unanswered+=1
        elif ans == q.answer_idx:
            correct+=1
            score+=1
        else:
            wrong+=1
            score-=0.25  # negative
    score = round(score,2)
    acc = round(correct/len(questions)*100,1) if questions else 0
    return correct,wrong,unanswered,score,acc

def _update_ranks(db: Session, tid: int):
    attempts = db.query(TournamentAttempt).filter(TournamentAttempt.tournament_id==tid).order_by(desc(TournamentAttempt.score), TournamentAttempt.time_taken).all()
    for idx, a in enumerate(attempts):
        a.rank = idx+1
        # xp rewards
        if idx==0: a.xp_earned = REWARDS[1]
        elif idx==1: a.xp_earned = REWARDS[2]
        elif idx==2: a.xp_earned = REWARDS[3]
        elif idx<10: a.xp_earned = REWARDS["top10"]
        else: a.xp_earned = REWARDS["participation"]
    db.commit()

@router.get("/current")
@router_v1.get("/current")
@weekly_router.get("")
def current(db: Session = Depends(get_db), current_user = Depends(get_current_user_optional)):
    t = _ensure_weekly(db)
    # my attempt
    my = None
    if current_user:
        my = db.query(TournamentAttempt).filter(TournamentAttempt.tournament_id==t.id, TournamentAttempt.user_id==current_user.id).first()
    # top 10
    top = db.query(TournamentAttempt, User).join(User, TournamentAttempt.user_id==User.id).filter(TournamentAttempt.tournament_id==t.id).order_by(TournamentAttempt.rank).limit(10).all()
    top_list = [{"rank": a.rank, "username": u.name[:2]+"***"+str(u.id)[-1], "score": a.score, "accuracy": a.accuracy, "time_taken": a.time_taken, "xp": a.xp_earned} for a,u in top]
    return {"tournament": {"id": t.id, "title": t.title, "start_date": t.start_date, "end_date": t.end_date, "duration_minutes": t.duration_minutes, "total_questions": t.total_questions, "status": t.status}, "my_attempt": {"score": my.score, "rank": my.rank, "accuracy": my.accuracy, "time_taken": my.time_taken, "xp": my.xp_earned} if my else None, "top": top_list, "rewards": REWARDS}

@router.get("/{tid}")
@router_v1.get("/{tid}")
def get_one(tid: int, db: Session = Depends(get_db)):
    t = db.query(Tournament).filter(Tournament.id==tid).first()
    if not t: raise HTTPException(404, "Tournament not found")
    qs = db.query(TournamentQuestion, Question).join(Question, TournamentQuestion.question_id==Question.id).filter(TournamentQuestion.tournament_id==tid).order_by(TournamentQuestion.question_order).all()
    questions = [{"id": q.id, "text": q.text, "options": q.options, "subject": q.subject, "topic": q.topic} for _, q in qs]
    return {"tournament": {"id": t.id, "title": t.title, "start_date": t.start_date, "end_date": t.end_date, "duration_minutes": t.duration_minutes, "total_questions": t.total_questions}, "questions": questions}

@router.post("/{tid}/submit")
@router_v1.post("/{tid}/submit")
@weekly_router.post("/{tid}/submit")
def submit(tid: int, payload: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # payload: {answers: [int], time_taken: float}
    t = db.query(Tournament).filter(Tournament.id==tid).first()
    if not t: raise HTTPException(404, "Not found")
    if db.query(TournamentAttempt).filter(TournamentAttempt.tournament_id==tid, TournamentAttempt.user_id==current_user.id).first():
        raise HTTPException(400, "Already submitted - one attempt per tournament")
    qs = db.query(TournamentQuestion, Question).join(Question, TournamentQuestion.question_id==Question.id).filter(TournamentQuestion.tournament_id==tid).order_by(TournamentQuestion.question_order).all()
    questions = [q for _, q in qs]
    answers = payload.get("answers", [])
    time_taken = float(payload.get("time_taken", t.duration_minutes*60))
    correct,wrong,unanswered,score,acc = _score_payload(answers, questions, time_taken)
    att = TournamentAttempt(tournament_id=tid, user_id=current_user.id, score=score, correct_answers=correct, wrong_answers=wrong, unanswered=unanswered, accuracy=acc, time_taken=time_taken, rank=None, xp_earned=REWARDS["participation"])
    db.add(att); db.commit(); db.refresh(att)
    _update_ranks(db, tid)
    db.refresh(att)
    # badge logic simple
    badges = []
    if att.rank==1: badges.append(BADGES[1])
    elif att.rank and att.rank<=10: badges.append(BADGES[2])
    if acc>=90: badges.append(BADGES[4])
    if time_taken < t.duration_minutes*60*0.6: badges.append(BADGES[3])
    return {"score": att.score, "correct": correct, "wrong": wrong, "unanswered": unanswered, "accuracy": acc, "time_taken": time_taken, "rank": att.rank, "xp": att.xp_earned, "badges": badges}

@router.get("")
@router_v1.get("")
@weekly_router.get("/history")
def history(limit: int = 5, db: Session = Depends(get_db), current_user = Depends(get_current_user_optional)):
    # ensure current
    _ensure_weekly(db)
    ts = db.query(Tournament).order_by(Tournament.start_date.desc()).limit(limit).all()
    out=[]
    for t in ts:
        my = None
        if current_user:
            my = db.query(TournamentAttempt).filter(TournamentAttempt.tournament_id==t.id, TournamentAttempt.user_id==current_user.id).first()
        out.append({"id": t.id, "title": t.title, "start_date": t.start_date, "end_date": t.end_date, "status": t.status, "my_score": my.score if my else None, "my_rank": my.rank if my else None})
    return out

@router.get("/{tid}/leaderboard")
@router_v1.get("/{tid}/leaderboard")
@weekly_router.get("/{tid}/leaderboard")
def leaderboard(tid: int, db: Session = Depends(get_db)):
    _update_ranks(db, tid)
    rows = db.query(TournamentAttempt, User).join(User, TournamentAttempt.user_id==User.id).filter(TournamentAttempt.tournament_id==tid).order_by(TournamentAttempt.rank).limit(50).all()
    return [{"rank": a.rank, "username": u.name[:2]+"***", "score": a.score, "accuracy": a.accuracy, "time_taken": a.time_taken, "xp": a.xp_earned} for a,u in rows]

# Admin: create tournament
@router.post("/admin/create")
def admin_create(data: dict, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.role != "admin": raise HTTPException(403, "Admin only")
    t = Tournament(**data); db.add(t); db.commit(); db.refresh(t); return t
