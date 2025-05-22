from fastapi import APIRouter, HTTPException
from app.models.tts import TTSRequest, TTSResponse
from app.services.tts import text_to_speech

router = APIRouter(prefix="/api", tags=["tts"])

@router.post("/tts", response_model=TTSResponse)
async def generate_tts(request: TTSRequest):
    try:
        audio_url = await text_to_speech(request.text, request.language)
        return TTSResponse(audio_url=audio_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")