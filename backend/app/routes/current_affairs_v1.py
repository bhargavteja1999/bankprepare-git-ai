from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import date, timedelta
from pydantic import BaseModel
from ..database import get_db
from ..utils.security import get_current_user, get_current_user_optional
from ..models.user import User
from ..models.current_affair import CurrentAffair
from ..models.current_affairs_question import CurrentAffairsQuestion

router_v1 = APIRouter(prefix="/api/v1/current-affairs", tags=["current-affairs-v1"])
legacy_router = APIRouter(prefix="/api/current-affairs-v2", tags=["current-affairs-v2"])  # avoid clash with existing

CATEGORIES = ["Banking & Finance","RBI","Economy","Government Schemes","Appointments","Awards","Sports","International Affairs","National Affairs","Important Days","Business","Static GK","Banking Awareness"]

class CAIn(BaseModel):
    headline: str
    summary: str
    content: Optional[str] = None
    category: str = "Banking & Finance"
    source_name: str = "PIB"
    source_url: Optional[str] = None
    published_date: str  # YYYY-MM-DD
    tags: Optional[List[str]] = []
    verification_status: str = "pending"

class CAQIn(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_answer: str  # A/B/C/D
    explanation: Optional[str] = ""

def _to_out(ca):
    # unify headline/title, published_date/date
    headline = ca.headline or ca.title or ""
    pub = ca.published_date or ca.date
    return {
        "id": ca.id,
        "headline": headline,
        "title": headline,
        "summary": ca.summary,
        "content": ca.content,
        "category": ca.category,
        "source_name": ca.source_name or ca.source,
        "source_url": ca.source_url,
        "published_date": pub,
        "date": pub,
        "tags": ca.tags or [],
        "verification_status": ca.verification_status,
        "quiz": ca.quiz  # legacy quiz JSON for backward compat
    }

@router_v1.get("")
def list_ca(category: Optional[str]=None, verification_status: Optional[str]="verified", limit: int = Query(20, le=100), offset: int = 0, db: Session = Depends(get_db)):
    q = db.query(CurrentAffair)
    if category: q = q.filter(CurrentAffair.category==category)
    if verification_status: q = q.filter(CurrentAffair.verification_status==verification_status)
    rows = q.order_by(CurrentAffair.published_date.desc().nullslast(), CurrentAffair.date.desc().nullslast()).offset(offset).limit(limit).all()
    return [_to_out(r) for r in rows]

@router_v1.get("/categories")
def categories():
    return CATEGORIES

@router_v1.get("/daily")
def daily(db: Session = Depends(get_db)):
    today = date.today()
    row = db.query(CurrentAffair).filter((CurrentAffair.published_date==today) | (CurrentAffair.date==today)).first()
    if not row:
        row = db.query(CurrentAffair).order_by(CurrentAffair.published_date.desc().nullslast()).first()
    if not row: raise HTTPException(404, "No current affairs")
    # quiz for daily
    qs = db.query(CurrentAffairsQuestion).filter(CurrentAffairsQuestion.current_affair_id==row.id).all()
    legacy_quiz = row.quiz or []
    quiz = [{"question_text": q.question_text, "options": [q.option_a,q.option_b,q.option_c,q.option_d], "correct_answer": q.correct_answer, "explanation": q.explanation} for q in qs] if qs else legacy_quiz
    out = _to_out(row)
    out["quiz"] = quiz
    return out

@router_v1.get("/weekly")
def weekly(db: Session = Depends(get_db)):
    monday = date.today() - timedelta(days=date.today().weekday())
    rows = db.query(CurrentAffair).filter((CurrentAffair.published_date>=monday) | (CurrentAffair.date>=monday)).order_by(CurrentAffair.published_date.desc()).limit(20).all()
    return [_to_out(r) for r in rows]

@router_v1.get("/monthly")
def monthly(months: int = Query(1, ge=1, le=6), db: Session = Depends(get_db)):
    since = date.today() - timedelta(days=30*months)
    rows = db.query(CurrentAffair).filter((CurrentAffair.published_date>=since) | (CurrentAffair.date>=since)).order_by(CurrentAffair.published_date.desc()).all()
    return [_to_out(r) for r in rows]

@router_v1.get("/quiz")
def quiz_get(category: Optional[str]=None, limit: int = Query(10, le=50), db: Session = Depends(get_db)):
    # prioritize CurrentAffairsQuestion table, fallback to legacy quiz JSON
    q = db.query(CurrentAffairsQuestion, CurrentAffair).join(CurrentAffair, CurrentAffairsQuestion.current_affair_id==CurrentAffair.id)
    if category: q = q.filter(CurrentAffair.category==category)
    rows = q.limit(limit).all()
    if rows:
        return [{"id": cq.id, "question_text": cq.question_text, "options": [cq.option_a,cq.option_b,cq.option_c,cq.option_d], "correct_answer": cq.correct_answer, "explanation": cq.explanation, "category": ca.category, "date": ca.published_date or ca.date, "source": ca.source_name or ca.source} for cq, ca in rows]
    # fallback: flatten legacy quiz JSON (respect category filter so
    # per-category quizzes work even before admin adds question rows)
    cas_q = db.query(CurrentAffair)
    if category: cas_q = cas_q.filter(CurrentAffair.category==category)
    cas = cas_q.limit(10).all()
    out=[]
    for ca in cas:
        if len(out)>=limit: break
        if ca.quiz:
            for qq in ca.quiz:
                out.append({"question_text": qq.get("text"), "options": qq.get("options",[]), "correct_answer": ["A","B","C","D"][qq.get("answer_idx",0)] if qq.get("answer_idx") is not None else "A", "explanation": qq.get("explanation",""), "category": ca.category, "date": ca.published_date or ca.date, "source": ca.source_name or ca.source})
                if len(out)>=limit: break
    return out[:limit]

@router_v1.post("/quiz/submit")
def quiz_submit(payload: dict, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    # payload: {answers: [{question_id, selected: "A"/"B"}]}
    # deterministic scoring: +1 correct, -0.25 wrong, backend decides
    answers = payload.get("answers", [])
    score=0; correct=0; wrong=0
    for a in answers:
        qid = a.get("question_id")
        sel = a.get("selected")
        q = db.query(CurrentAffairsQuestion).filter(CurrentAffairsQuestion.id==qid).first()
        if not q:
            # try legacy? skip
            continue
        if sel == q.correct_answer:
            correct+=1; score+=1
        else:
            wrong+=1; score-=0.25
    score=round(score,2)
    acc=round(correct/len(answers)*100,1) if answers else 0
    return {"score": score, "correct": correct, "wrong": wrong, "accuracy": acc, "total": len(answers)}

@router_v1.get("/{cid}")
def get_one(cid: int, db: Session = Depends(get_db)):
    ca = db.query(CurrentAffair).filter(CurrentAffair.id==cid).first()
    if not ca: raise HTTPException(404, "Not found")
    out = _to_out(ca)
    qs = db.query(CurrentAffairsQuestion).filter(CurrentAffairsQuestion.current_affair_id==cid).all()
    out["questions"] = [{"id": q.id, "question_text": q.question_text, "options": [q.option_a,q.option_b,q.option_c,q.option_d], "correct_answer": q.correct_answer, "explanation": q.explanation} for q in qs]
    return out

# Admin
admin_router = APIRouter(prefix="/api/v1/admin/current-affairs", tags=["admin-ca"])
@admin_router.post("")
def admin_create(data: CAIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.role != "admin": raise HTTPException(403, "Admin only")
    if data.category not in CATEGORIES: raise HTTPException(400, f"Invalid category. Must be one of {CATEGORIES}")
    if "http" in (data.source_url or "") and not data.source_url.startswith("http"): raise HTTPException(400, "Invalid source_url")
    ca = CurrentAffair(headline=data.headline, title=data.headline, summary=data.summary, content=data.content, category=data.category, source_name=data.source_name, source=data.source_name, source_url=data.source_url, published_date=date.fromisoformat(data.published_date), date=date.fromisoformat(data.published_date), tags=data.tags, verification_status=data.verification_status)
    db.add(ca); db.commit(); db.refresh(ca)
    return _to_out(ca)

@admin_router.put("/{cid}")
def admin_update(cid: int, data: CAIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.role != "admin": raise HTTPException(403, "Admin only")
    ca = db.query(CurrentAffair).filter(CurrentAffair.id==cid).first()
    if not ca: raise HTTPException(404, "Not found")
    for k,v in data.dict().items():
        if k=="published_date": setattr(ca, "published_date", date.fromisoformat(v)); setattr(ca, "date", date.fromisoformat(v))
        elif k=="headline": setattr(ca, "headline", v); setattr(ca, "title", v)
        elif k=="source_name": setattr(ca, "source_name", v); setattr(ca, "source", v)
        else: setattr(ca, k, v)
    db.commit(); db.refresh(ca)
    return _to_out(ca)

@admin_router.delete("/{cid}")
def admin_delete(cid: int, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.role != "admin": raise HTTPException(403, "Admin only")
    ca = db.query(CurrentAffair).filter(CurrentAffair.id==cid).first()
    if not ca: raise HTTPException(404, "Not found")
    db.delete(ca); db.commit()
    return {"message": "Deleted"}

@admin_router.post("/{cid}/verify")
def admin_verify(cid: int, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.role != "admin": raise HTTPException(403, "Admin only")
    ca = db.query(CurrentAffair).filter(CurrentAffair.id==cid).first()
    if not ca: raise HTTPException(404, "Not found")
    ca.verification_status = "verified"
    db.commit()
    return _to_out(ca)

@admin_router.post("/{cid}/questions")
def admin_add_question(cid: int, data: CAQIn, db: Session = Depends(get_db), current: User = Depends(get_current_user)):
    if current.role != "admin": raise HTTPException(403, "Admin only")
    ca = db.query(CurrentAffair).filter(CurrentAffair.id==cid).first()
    if not ca: raise HTTPException(404, "CA not found")
    if data.correct_answer not in ["A","B","C","D"]: raise HTTPException(400, "correct_answer must be A/B/C/D")
    q = CurrentAffairsQuestion(current_affair_id=cid, question_text=data.question_text, option_a=data.option_a, option_b=data.option_b, option_c=data.option_c, option_d=data.option_d, correct_answer=data.correct_answer, explanation=data.explanation)
    db.add(q); db.commit(); db.refresh(q)
    return {"id": q.id, "created": True}
