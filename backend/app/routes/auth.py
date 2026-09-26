from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from ..database import get_db
from ..models.user import User
from ..models.progress import Progress
from ..schemas.auth import RegisterIn, LoginIn
from ..utils.security import hash_password, verify_password, create_access_token
from ..utils.validators import validate_password_strength

limiter = Limiter(key_func=get_remote_address)
router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
@limiter.limit("5/minute")
def register(request: Request, data: RegisterIn, db: Session = Depends(get_db)):
    if not validate_password_strength(data.password):
        raise HTTPException(400, "Password too weak: min 8 chars, mix of upper/lower/digit")
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(400, "User already exists")
    user = User(name=data.name, email=data.email, hashed_password=hash_password(data.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    # create progress row
    prog = Progress(user_id=user.id, syllabus_covered=0, questions_solved=0, accuracy=0, streak=1, xp=0, weak_topics=[])
    db.add(prog)
    db.commit()
    token = create_access_token({"sub": user.email})
    return {"message": "Registered", "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role}, "access_token": token, "token_type": "bearer"}

@router.post("/login")
@limiter.limit("10/minute")
def login(request: Request, data: LoginIn, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"message": "Logged in", "user": {"id": user.id, "email": user.email, "name": user.name, "role": user.role}, "access_token": token, "token_type": "bearer"}
