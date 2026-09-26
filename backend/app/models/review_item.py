from sqlalchemy import Column, Integer, ForeignKey, DateTime, Float
from sqlalchemy.sql import func
from ..database import Base

class ReviewItem(Base):
    __tablename__ = "review_items"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), index=True)
    ease = Column(Float, default=2.5)
    interval = Column(Integer, default=1)  # days
    due_date = Column(DateTime(timezone=True), server_default=func.now())
    repetitions = Column(Integer, default=0)
    last_reviewed = Column(DateTime(timezone=True), server_default=func.now())
