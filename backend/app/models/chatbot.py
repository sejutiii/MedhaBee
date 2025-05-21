from pydantic import BaseModel

class ChatbotRequest(BaseModel):
      query: str
      language: str = "en"  # "en" or "bn"
      
class ChatbotResponse(BaseModel):
      response: str