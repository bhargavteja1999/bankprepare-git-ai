from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from ..database import Base

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    subject = Column(String, index=True)
    question_ids = Column(JSON)  # list[int]
    duration_min = Column(Integer, default=10)
    difficulty = Column(String, default="medium")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
