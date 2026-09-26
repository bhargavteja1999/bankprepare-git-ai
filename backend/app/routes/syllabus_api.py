from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.subject import Subject
from ..models.topic import Topic, Subtopic

router = APIRouter(prefix="/api", tags=["syllabus"])

@router.get("/syllabus")
def get_syllabus(db: Session = Depends(get_db)):
    # ensure seeded (idempotent) — if empty, seed on demand
    subjects = db.query(Subject).order_by(Subject.display_order).all()
    if not subjects:
        try:
            from ..seed.syllabus_data import seed_syllabus
            seed_syllabus(db)
            subjects = db.query(Subject).order_by(Subject.display_order).all()
        except:
            pass
    # fallback hardcoded if still empty
    if not subjects:
        return [
            {"subject": "Quantitative Aptitude", "icon": "🔢", "description": "", "topics": [{"name": "Simplification", "progress": 95, "subtopics": []}], "overall": 68, "topic_count": 1, "subtopic_count": 0},
        ]
    result = []
    for subj in subjects:
        topics = db.query(Topic).filter(Topic.subject_id == subj.id).order_by(Topic.display_order).all()
        topic_list = []
        total_prog = 0
        subtopic_total = 0
        for t in topics:
            subs = db.query(Subtopic).filter(Subtopic.topic_id == t.id).order_by(Subtopic.display_order).all()
            sub_names = [s.name for s in subs]
            subtopic_total += len(sub_names)
            total_prog += t.progress or 0
            # derive progress label
            topic_list.append({
                "id": t.id,
                "name": t.name,
                "description": t.description or "",
                "progress": t.progress or 0,
                "status": "Not started" if (t.progress or 0)==0 else ("Completed" if t.progress>=90 else "In Progress"),
                "subtopics": sub_names,
                "subtopic_count": len(sub_names),
            })
        overall = round(total_prog / len(topics)) if topics else 0
        result.append({
            "subject": subj.name,
            "icon": subj.icon or "📚",
            "description": subj.description or "",
            "overall": overall,
            "progress": overall,
            "topics": topic_list,
            "topic_count": len(topic_list),
            "subtopic_count": subtopic_total,
        })
    return result

@router.get("/syllabus/subjects")
def list_subjects(db: Session = Depends(get_db)):
    subjects = db.query(Subject).order_by(Subject.display_order).all()
    return [{"id": s.id, "name": s.name, "icon": s.icon, "description": s.description} for s in subjects]
