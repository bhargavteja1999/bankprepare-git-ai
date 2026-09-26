from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.sql import func
from ..database import Base

class AdaptiveQuizSession(Base):
    __tablename__ = "adaptive_quiz_sessions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    current_difficulty = Column(String, default="Medium")
    questions_asked = Column(JSON, default=list)  # list of question_ids
    answers = Column(JSON, default=list)  # list of {question_id, selected, correct, time_taken}
    correct_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    average_time = Column(Float, default=0.0)
    status = Column(String, default="active")  # active/completed
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
