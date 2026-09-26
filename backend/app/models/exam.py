from sqlalchemy import Column, Integer, String, JSON
from ..database import Base

class Exam(Base):
    __tablename__ = "exams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    code = Column(String, unique=True, index=True)
    subjects = Column(JSON)  # list[str]
    duration_min = Column(Integer)
    total_questions = Column(Integer)
