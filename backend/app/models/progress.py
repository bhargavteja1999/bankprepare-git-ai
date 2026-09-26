from sqlalchemy import Column, Integer, String, JSON, ForeignKey
from ..database import Base

class Progress(Base):
    __tablename__ = "progress"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, index=True)
    syllabus_covered = Column(Integer, default=0)
    questions_solved = Column(Integer, default=0)
    accuracy = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    xp = Column(Integer, default=0)
    weak_topics = Column(JSON, default=list)
