from sqlalchemy.orm import Session
from ..models.progress import Progress
def get_or_create_progress(db: Session, user_id: int) -> Progress:
    prog = db.query(Progress).filter(Progress.user_id == user_id).first()
    if not prog:
        prog = Progress(user_id=user_id, syllabus_covered=0, questions_solved=0, accuracy=0, streak=1, xp=0, weak_topics=[])
        db.add(prog); db.commit(); db.refresh(prog)
    return prog
