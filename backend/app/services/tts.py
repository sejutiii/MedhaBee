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

        return "/static/temp_audio.wav"  # Serve via static route
    except Exception as e:
        raise Exception(f"TTS error: {str(e)}")