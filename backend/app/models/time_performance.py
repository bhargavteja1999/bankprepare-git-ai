from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey, String
from sqlalchemy.sql import func
from ..database import Base

class TimePerformance(Base):
    __tablename__ = "time_performance"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), index=True)
    subject_name = Column(String, default="General")
    topic_name = Column(String, default="General")
    time_spent = Column(Float, nullable=False)  # seconds
    is_correct = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
