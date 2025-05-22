from fastapi import APIRouter, HTTPException, Response
from app.models.tts import TTSRequest, TTSResponse
from app.services.tts import text_to_speech
import azure.cognitiveservices.speech as speechsdk
from pathlib import Path
from dotenv import load_dotenv
import os

load_dotenv()

# Azure Speech configuration
speech_key = os.getenv("AZURE_SPEECH_KEY")
speech_region = os.getenv("AZURE_SPEECH_REGION")

if not speech_key or not speech_region:
    raise ValueError("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set in .env")

router = APIRouter(prefix="/api", tags=["tts"])

@router.post("/tts", response_model=TTSResponse)
async def generate_tts(request: TTSRequest):
    try:
        audio_url = await text_to_speech(request.text, request.language)
        return TTSResponse(audio_url=audio_url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS error: {str(e)}")

@router.get("/play-audio")
async def play_audio():
    audio_path = "temp_audio.wav"  # Remove 'static/' prefix, file is in backend root
    try:
        with open(audio_path, "rb") as audio_file:
            audio_data = audio_file.read()
        return Response(
            content=audio_data,
            media_type="audio/wav",
            headers={
                "Content-Disposition": "inline; filename=temp_audio.wav",
                "Access-Control-Allow-Origin": "*",  # Handle CORS
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving audio: {str(e)}")

async def text_to_speech(text: str, language: str = "en") -> str:
    try:
        # Configure speech synthesis
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
        speech_config.speech_synthesis_voice_name = "bn-BD-NabanitaNeural" if language.lower() == "bn" else "en-US-JennyNeural"
        
        # Use file output
        audio_config = speechsdk.audio.AudioOutputConfig(filename="temp_audio.wav")
        synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_config)

        # Synthesize speech
        result = synthesizer.speak_text_async(text).get()
        if result.reason != speechsdk.ResultReason.SynthesizingAudioCompleted:
            raise Exception(f"TTS failed: {result.reason}")

        return "/api/play-audio"  # Return the new endpoint URL
    except Exception as e:
        raise Exception(f"TTS error: {str(e)}")