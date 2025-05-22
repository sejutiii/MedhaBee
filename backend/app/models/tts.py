from pydantic import BaseModel

class TTSRequest(BaseModel):
    text: str
    language: str = "en"  # "en" or "bn"

class TTSResponse(BaseModel):
    audio_url: str

class STTResponse(BaseModel):
    text: str