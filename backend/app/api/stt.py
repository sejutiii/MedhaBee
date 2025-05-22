from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from app.models.tts import STTResponse
from app.services.stt import transcribe_audio_file

router = APIRouter(prefix="/api", tags=["stt"])

@router.post("/stt", response_model=STTResponse)
async def recognize_speech(audio: UploadFile = File(...), language: str = Form(...)):
    try:
        # Perform STT
        text = await transcribe_audio_file(audio.file, language)
        return STTResponse(text=text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"STT error: {str(e)}")