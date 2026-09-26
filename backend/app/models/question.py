from sqlalchemy import Column, Integer, String, Text, JSON
from ..database import Base

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    topic = Column(String, index=True)
    difficulty = Column(String)
    text = Column(Text, nullable=False)
    options = Column(JSON, nullable=False)  # list[str]
    answer_idx = Column(Integer, nullable=False)
    explanation = Column(Text)
