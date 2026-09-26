from sqlalchemy import Column, Integer, String, Text, Date, JSON, DateTime, Boolean
from sqlalchemy.sql import func
from ..database import Base

class CurrentAffair(Base):
    __tablename__ = "current_affairs"
    id = Column(Integer, primary_key=True, index=True)
    # legacy fields (keep for backward compat)
    date = Column(Date, index=True, nullable=True)
    title = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    source = Column(String, default="PIB/RBI")
    quiz = Column(JSON, nullable=True)  # legacy: list[{text, options, answer_idx, explanation}]
    # new spec fields
    headline = Column(String, nullable=True)
    content = Column(Text, nullable=True)
    category = Column(String, index=True, default="Banking & Finance")
    source_name = Column(String, default="PIB")
    source_url = Column(String, nullable=True)
    published_date = Column(Date, index=True, nullable=True)
    tags = Column(JSON, default=list)
    verification_status = Column(String, default="verified")  # verified/pending/rejected
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # helpers for unified access
    @property
    def display_headline(self):
        return self.headline or self.title or ""
    @property
    def display_date(self):
        return self.published_date or self.date
