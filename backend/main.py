from fastapi import FastAPI
from app.routers.home import router as home_router
from app.routers.courses import router as course_router
from app.routers.study_tips import router as study_router
from app.routers.ai import router as ai_router

from fastapi.middleware.cors import CORSMiddleware
from app.database.database import engine
from app.database.models import Base

app = FastAPI()

Base.metadata.create_all(bind=engine)

origins=[
    "http://localhost:5173/",
    "http://127.0.0.1:5173",    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(home_router)
app.include_router(course_router)
app.include_router(study_router)
app.include_router(ai_router, prefix="/ai")

@app.get("/")
async def root():
    return {"message": "Hello World"}