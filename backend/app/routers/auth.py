from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.database.database import SessionLocal
from app.database.models import User
from passlib.context import CryptContext
import jwt
import os
from datetime import datetime, timedelta

router = APIRouter()

pwd = CryptContext(schemes=["argon2"], deprecated="auto")
JWT_SECRET = os.getenv("JWT_SECRET","supersecret123")

class RegisterRequest(BaseModel):
    email : str
    password : str

class LoginRequest(BaseModel):
    email: str
    password : str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/register")
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use")

    hashed = pwd.hash(req.password)
    new_user = User(email=req.email, password_hash=hashed)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not pwd.verify(req.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = jwt.encode(
        {"user_id": user.id, "exp": datetime.utcnow() + timedelta(days=7)},
        JWT_SECRET, 
        algorithm="HS256"
    )

    return {"token": token, "email": user.email}