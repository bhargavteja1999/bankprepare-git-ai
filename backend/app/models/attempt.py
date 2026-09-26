from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class Attempt(Base):
    __tablename__ = "attempts"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    answers = Column(JSON)
    score = Column(Integer)
    total = Column(Integer)
    accuracy = Column(Integer)
    xp_earned = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
