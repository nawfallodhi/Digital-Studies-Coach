from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.models import RequestHistory
from app.database.database import SessionLocal
import os
import openai 

load_dotenv()
client = openai.OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url= "https://openrouter.ai/api/v1"
)

router = APIRouter()

class AIRequest(BaseModel):
    topic: str
    question: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/generate")
def generate_response(request: AIRequest, db: Session = Depends(get_db)):
    user_input = request.question
    response = client.chat.completions.create(
        model="x-ai/grok-4.1-fast:free",
        messages=[
            {"role": "user", "content": user_input},
            {"role": "system", "content": "You are an AI tutor. If MATH related prompt format in Latex style."}
        ]
    )
    ai_text = response.choices[0].message.content

    history_entry = RequestHistory(
        topic = request.topic,
        question = request.question,
        answer = ai_text
    )
    db.add(history_entry)
    db.commit()

    return {"answer": ai_text}

@router.get("/history")
def get_history(db: Session = Depends(get_db)):
    entries = db.query(RequestHistory).order_by(RequestHistory.created_at.desc()).all()
    return entries