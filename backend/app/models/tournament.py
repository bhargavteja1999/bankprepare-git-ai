from sqlalchemy import Column, Integer, String, Text, DateTime, Date
from sqlalchemy.sql import func
from ..database import Base

class Tournament(Base):
    __tablename__ = "tournaments"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    duration_minutes = Column(Integer, default=60)
    total_questions = Column(Integer, default=50)
    status = Column(String, default="active")  # upcoming/active/ended
    created_at = Column(DateTime(timezone=True), server_default=func.now())
