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
import json 
import re

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

def repair_and_extract_json(text: str) -> dict:
    """Extract and repair JSON object from AI response"""
    try:
        # Remove markdown code blocks
        text = re.sub(r'```json\s*', '', text, flags=re.IGNORECASE)
        text = re.sub(r'```\s*', '', text)
        
        # Find JSON object boundaries
        start = text.find('{')
        end = text.rfind('}')
        
        if start == -1 or end == -1:
            raise ValueError("No JSON object found in response")
        
        json_str = text[start:end+1]
        
        # Fix common JSON errors from AI:
        # 1. Fix: "C) $\\frac{1}{3}$, "D) -> "C) $\\frac{1}{3}$", "D)
        json_str = re.sub(r'(\$[^"]*),(\s*"[A-D]\))', r'\1",\2', json_str)
        
        # 2. Fix any remaining quote-comma-quote issues
        json_str = re.sub(r'",\s*"', '", "', json_str)
        
        print("=== REPAIRED JSON ===")
        print(json_str[:500])  # Print first 500 chars for debugging
        print("=== END ===")
        
        # Try to parse
        quiz_data = json.loads(json_str)
        
        # Validate structure
        if 'questions' not in quiz_data or not isinstance(quiz_data['questions'], list):
            raise ValueError("Invalid quiz structure")
        
        return quiz_data
        
    except json.JSONDecodeError as e:
        print(f"JSON decode error at position {e.pos}: {e.msg}")
        if e.pos < len(json_str):
            print(f"Near: ...{json_str[max(0, e.pos-50):e.pos+50]}...")
        raise ValueError(f"Invalid JSON: {str(e)}")

@router.post("/generate")
def generate_response(request: AIRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    print("User input:", request.question)
    print("Current user:", current_user)  # Will show if auth worked

    
    user_input = request.question
    try:
        if request.topic == "quiz_generator":
            system_content = (
                "You are a quiz generator AI. "
                "You MUST respond with ONLY a valid JSON object - no other text, no explanations, no markdown code blocks. "
                "For mathematical expressions, use LaTeX with $ delimiters (e.g., $x^2$, $\\frac{a}{b}$). "
                "CRITICAL: In JSON strings, backslashes must be escaped. Use \\\\frac NOT \\frac, \\\\int NOT \\int, etc. "
                "Your response should be parseable by JSON.parse() with no modifications. "
                "Start your response with { and end with } - nothing else."
            )
        elif request.topic == "flashcard_generator":
            system_content = (
                "You are a flashcard generator AI. "
                "You MUST respond with ONLY a valid JSON object - no other text. "
                "\n\nCRITICAL JSON FORMATTING RULES:\n"
                "1. Use double backslashes in LaTeX: \\\\frac NOT \\frac\n"
                "2. All strings must be properly quoted\n"
                "3. No trailing commas\n"
                "\nFor math, use LaTeX with $ delimiters inside properly quoted strings."
            )
        else:
            system_content = (
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

        response = client.chat.completions.create(
            model="meta-llama/llama-3.3-70b-instruct:free",
            messages=[
                {   "role": "system", 
                    "content": system_content
                },
                {"role": "user", "content": user_input}
            ]
        )
        ai_text = response.choices[0].message.content

        if request.topic in ["quiz_generator","flashcard_generator"]:
            try:
                quiz_data = repair_and_extract_json(ai_text)
                # Return the cleaned JSON as a string
                ai_text = json.dumps(quiz_data)
                print("✓ Successfully parsed and repaired quiz JSON")
            except ValueError as e:
                print(f"⚠ Warning: Could not parse quiz JSON: {e}")
                print("Returning raw response")
                # Return raw response as fallback
        

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