from sqlalchemy import Column, Integer, String, JSON
from ..database import Base

class Game(Base):
    __tablename__ = "games"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    config = Column(JSON)
