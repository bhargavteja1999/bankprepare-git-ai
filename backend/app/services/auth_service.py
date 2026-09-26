"""Auth service - hashing + user creation (extracted from routes/auth.py for testability)."""
from sqlalchemy.orm import Session
from ..models.user import User
from ..utils.security import hash_password

def create_user(db: Session, name: str, email: str, password: str, role: str = "student") -> User:
    user = User(name=name, email=email, hashed_password=hash_password(password), role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
