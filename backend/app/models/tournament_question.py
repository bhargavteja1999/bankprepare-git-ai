from sqlalchemy import Column, Integer, ForeignKey
from ..database import Base

class TournamentQuestion(Base):
    __tablename__ = "tournament_questions"
    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), index=True, nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), index=True, nullable=False)
    question_order = Column(Integer, default=0)
