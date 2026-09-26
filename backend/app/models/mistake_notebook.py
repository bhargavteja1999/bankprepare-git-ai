from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.sql import func
from ..database import Base

class MistakeNotebook(Base):
    __tablename__ = "mistake_notebooks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), index=True, nullable=False)
    selected_answer = Column(Integer, nullable=False)
    correct_answer = Column(Integer, nullable=False)
    mistake_count = Column(Integer, default=1)
    personal_note = Column(Text, default="")
    is_reviewed = Column(Boolean, default=False)
    is_important = Column(Boolean, default=False)
    is_fixed = Column(Boolean, default=False)
    time_taken = Column(Float, default=0)  # seconds
    last_reviewed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
