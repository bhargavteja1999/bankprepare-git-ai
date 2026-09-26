from sqlalchemy import Column, Integer, ForeignKey, DateTime, Text, UniqueConstraint
from sqlalchemy.sql import func
from ..database import Base

class Bookmark(Base):
    __tablename__ = "bookmarks"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    question_id = Column(Integer, ForeignKey("questions.id"), index=True)
    note = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("user_id", "question_id", name="uq_bookmark"),)
