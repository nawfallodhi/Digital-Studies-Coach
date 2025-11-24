from fastapi import APIRouter

router = APIRouter()
@router.get("/courses")

def some_function():
    return {"message": "courses route is running!"}