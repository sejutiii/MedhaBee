from pydantic import BaseModel

class UserData(BaseModel):
    user_id: str
    language_preference: str = "en"  # Default to English