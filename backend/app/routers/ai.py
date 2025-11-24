from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv
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

@router.post("/generate")
def generate_response(request: AIRequest):
    user_input = request.question
    response = client.chat.completions.create(
        model="x-ai/grok-4.1-fast:free",
        messages=[{"role": "user", "content": user_input}]
    )
    ai_text = response.choices[0].message.content
    return {"answer": ai_text}