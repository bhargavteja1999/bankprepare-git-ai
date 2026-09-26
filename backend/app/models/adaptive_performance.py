from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class AdaptivePerformance(Base):
    __tablename__ = "adaptive_performance"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    subject = Column(String, index=True, default="General")  # subject name
    topic = Column(String, index=True, default="General")
    current_difficulty = Column(String, default="Medium")  # Easy/Medium/Hard
    correct_streak = Column(Integer, default=0)
    wrong_streak = Column(Integer, default=0)
    accuracy = Column(Float, default=0.0)
    average_time = Column(Float, default=0.0)
    questions_attempted = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
