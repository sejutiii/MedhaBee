from fastapi import APIRouter, Depends, HTTPException
from app.models.user import UserData
from app.config.database import get_database
from app.dependencies.auth import verify_clerk_token

router = APIRouter(prefix="/api", tags=["auth"])

@router.post("/user")
async def create_user(user_data: UserData, user_id: str = Depends(verify_clerk_token)):
    db = get_database()
    users_collection = db["users"]
    existing_user = users_collection.find_one({"user_id": user_id})
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    user_doc = {"user_id": user_id, "language_preference": user_data.language_preference}
    users_collection.insert_one(user_doc)
    return {"message": "User created", "user_id": user_id}

@router.get("/user")
async def get_user(user_id: str = Depends(verify_clerk_token)):
    db = get_database()
    users_collection = db["users"]
    user = users_collection.find_one({"user_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"user_id": user["user_id"], "language_preference": user["language_preference"]}

@router.get("/guest")
async def guest_access():
    return {"message": "Guest access granted, no data will be saved"}