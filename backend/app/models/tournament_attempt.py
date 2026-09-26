from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from ..database import Base

class TournamentAttempt(Base):
    __tablename__ = "tournament_attempts"
    id = Column(Integer, primary_key=True, index=True)
    tournament_id = Column(Integer, ForeignKey("tournaments.id"), index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), index=True, nullable=False)
    score = Column(Float, default=0)  # with negative marking
    correct_answers = Column(Integer, default=0)
    wrong_answers = Column(Integer, default=0)
    unanswered = Column(Integer, default=0)
    accuracy = Column(Float, default=0)
    time_taken = Column(Float, default=0)  # seconds
    rank = Column(Integer, nullable=True)
    xp_earned = Column(Integer, default=0)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())
    __table_args__ = (UniqueConstraint("tournament_id", "user_id", name="uq_tournament_user"),)
