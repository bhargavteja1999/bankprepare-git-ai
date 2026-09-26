from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from ..database import Base

class CurrentAffairsQuestion(Base):
    __tablename__ = "current_affairs_questions"
    id = Column(Integer, primary_key=True, index=True)
    current_affair_id = Column(Integer, ForeignKey("current_affairs.id"), index=True, nullable=False)
    question_text = Column(Text, nullable=False)
    option_a = Column(String, nullable=False)
    option_b = Column(String, nullable=False)
    option_c = Column(String, nullable=False)
    option_d = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)  # A/B/C/D
    explanation = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
