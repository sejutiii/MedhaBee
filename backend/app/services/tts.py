from parler_tts import ParlerTTSForConditionalGeneration, ParlerTTSTokenizer
import torch
from pathlib import Path
import soundfile as sf

# Load model and tokenizer
device = "cuda" if torch.cuda.is_available() else "cpu"
model_name = "ai4bharat/indic-parler-tts-mini-v1-hf"
model = ParlerTTSForConditionalGeneration.from_pretrained(model_name).to(device)
tokenizer = ParlerTTSTokenizer.from_pretrained(model_name)

async def text_to_speech(text: str, language: str = "en") -> str:
    try:
        # Map language to voice description
        voice_description = "a female Bangla speaker with a calm tone in a quiet room" if language.lower() == "bn" else "a female Indian English speaker with a clear voice in a quiet room"

        # Chunk text if longer than 30 seconds (model limit)
        if len(text.split()) > 150:  # Rough estimate: 150 words ~ 30 seconds
            raise ValueError("Text too long; keep under 150 words for demo.")

        # Prepare input
        prompt = f"{voice_description}: {text}"
        inputs = tokenizer(prompt, return_tensors="pt").to(device)

        # Generate audio
        with torch.no_grad():
            audio = model.generate(
                input_ids=inputs["input_ids"],
                attention_mask=inputs["attention_mask"],
                max_length=1000  # Adjust based on text length
            )

        # Save audio to file
        audio_file = Path("temp_audio.wav")
        audio_array = audio[0].cpu().numpy()  # First batch, move to CPU
        sf.write(audio_file, audio_array, samplerate=model.config.sampling_rate)

        return "/static/temp_audio.wav"  # Serve via static route
    except Exception as e:
        raise Exception(f"TTS error: {str(e)}")