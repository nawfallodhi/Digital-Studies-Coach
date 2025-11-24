from fastapi import APIRouter

router = APIRouter()
@router.get("/study-tips")

def some_function():
    return {"message": "study-tips route is running!"}