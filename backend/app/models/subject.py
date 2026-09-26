from sqlalchemy import Column, Integer, String, Text
from ..database import Base

class Subject(Base):
    __tablename__ = "subjects"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, default="")
    icon = Column(String, default="📚")
    display_order = Column(Integer, default=0)
