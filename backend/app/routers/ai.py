from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.models import RequestHistory, User
from app.database.database import SessionLocal
from app.routers.auth import get_current_user
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
def generate_response(request: AIRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("User input:", request.question)
    print("Current user:", current_user)  # Will show if auth worked

    
    user_input = request.question
    try:
        response = client.chat.completions.create(
            model="x-ai/grok-4.1-fast:free",
            messages=[
                {   "role": "system", 
                    "content": (
                        "You are an AI tutor."
                        "When producing math, ALWAYS use proper LaTeX delimiters: "
                        "• Inline math → $ ... $ "
                        "• Block math → $$ ... $$ "
                        "Never write mathematical expressions inside parentheses like ( a ) or ( a \mid b ). "
                        "Always convert them to LaTeX: $a$, $a \mid b$, etc."
                        "You may freely use Markdown for formatting (**, lists, headings, etc)."
                        "Math must stay inside $...$ or $$...$$ so the frontend can render correctly. "
                        "Don't include any policies, a revision of the prompt or any of your own thoughts/anaylysis. just answer the prompt"
                    )
                },
                {"role": "user", "content": user_input}
            ]
        )
        ai_text = response.choices[0].message.content
    except Exception as e:
        print("openrouter call failed",e)
        raise e

    history_entry = RequestHistory(
        topic = request.topic,
        question = request.question,
        answer = ai_text,
        user_id =current_user.id
    )
    db.add(history_entry)
    db.commit()

    return {"answer": ai_text}

@router.get("/history")
def get_history(
    db: Session = Depends(get_db), user: User = Depends(get_current_user)
):
    entries = db.query(RequestHistory).filter(RequestHistory.user_id == user.id).all()
    return entries