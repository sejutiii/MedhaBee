import azure.cognitiveservices.speech as speechsdk
from dotenv import load_dotenv
import os
import asyncio
import tempfile
import ffmpeg
import logging

load_dotenv()

# Azure Speech configuration
speech_key = os.getenv("AZURE_SPEECH_KEY")
speech_region = os.getenv("AZURE_SPEECH_REGION")

if not speech_key or not speech_region:
    raise ValueError("AZURE_SPEECH_KEY and AZURE_SPEECH_REGION must be set in .env")

async def transcribe_audio_file(file_obj, language: str):
    import shutil
    logging.basicConfig(level=logging.DEBUG)
    logger = logging.getLogger("stt")
    logger.debug("Starting STT transcription")
    wav_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
    try:
        logger.debug("Saving uploaded WAV file to temp file: %s", wav_tmp.name)
        # Save uploaded WAV file
        file_obj.seek(0)
        shutil.copyfileobj(file_obj, wav_tmp)
        wav_tmp.close()
        wav_path = wav_tmp.name
        logger.debug("Saved uploaded file to: %s", wav_path)

        # Ensure WAV format is compatible (16kHz, 16-bit, mono)
        wav_converted = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
        wav_converted.close()
        wav_converted_path = wav_converted.name
        logger.debug("Converting WAV to Azure compatible format: %s", wav_converted_path)
        try:
            (
                ffmpeg
                .input(wav_path)
                .output(wav_converted_path, format='wav', acodec='pcm_s16le', ac=1, ar='16000')
                .run(quiet=True, overwrite_output=True)
            )
            logger.debug("ffmpeg conversion successful")
        except ffmpeg.Error as e:
            logger.error("ffmpeg conversion failed: %s", e.stderr.decode() if hasattr(e, 'stderr') and e.stderr else str(e))
            raise Exception(f"ffmpeg conversion failed: {e.stderr.decode() if hasattr(e, 'stderr') and e.stderr else str(e)}")

        # Transcribe WAV file
        logger.debug("Starting Azure STT transcription")
        speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=speech_region)
        speech_config.speech_recognition_language = "bn-IN" if language.lower() == "bn" else "en-US"
        audio_config = speechsdk.audio.AudioConfig(filename=wav_converted_path)
        recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)
        
        result = recognizer.recognize_once()
        logger.debug("Azure STT result: reason=%s, text=%s", result.reason, getattr(result, 'text', None))
        
        if result.reason == speechsdk.ResultReason.RecognizedSpeech:
            return result.text
        elif result.reason == speechsdk.ResultReason.NoMatch:
            logger.warning("No speech could be recognized.")
            return "No speech could be recognized."
        else:
            details = result.cancellation_details.error_details if hasattr(result, 'cancellation_details') else str(result)
            logger.error("Speech Recognition canceled: %s", details)
            raise Exception(f"Speech Recognition canceled: {details}")
            
    finally:
        # Clean up temporary files
        try:
            os.unlink(wav_tmp.name)
        except Exception as e:
            logger.warning("Failed to delete temp wav_tmp: %s", e)
        try:
            os.unlink(wav_converted_path)
        except Exception as e:
            logger.warning("Failed to delete temp wav_converted: %s", e)