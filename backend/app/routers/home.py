from fastapi import APIRouter

router = APIRouter()
@router.get("/")

def some_function():
    return {"message": "Api route is running!"}