from dotenv import load_dotenv
import os
import google.generativeai as genai

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

async def get_gemini_response(query: str, language: str = "en") -> str:
    try:
        model = genai.GenerativeModel("gemini-2.0-flash")
        prompt = f"Answer the following query in {language}: {query}"
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")