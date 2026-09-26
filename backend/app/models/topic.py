from sqlalchemy import Column, Integer, String, ForeignKey, Text
from ..database import Base

class Topic(Base):
    __tablename__ = "topics"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), index=True)
    description = Column(Text, default="")
    display_order = Column(Integer, default=0)
    progress = Column(Integer, default=0)

class Subtopic(Base):
    __tablename__ = "subtopics"
    id = Column(Integer, primary_key=True)
    name = Column(String, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), index=True)
    description = Column(Text, default="")
    display_order = Column(Integer, default=0)
