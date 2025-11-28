from fastapi import APIRouter

router = APIRouter()
@router.get("/study-tips")

def get_history():
    return {"message": "study-tips route is running!"}