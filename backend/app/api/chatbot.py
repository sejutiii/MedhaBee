from fastapi import APIRouter, HTTPException
from app.models.chatbot import ChatbotRequest, ChatbotResponse
from app.services.gemini import get_gemini_response

router = APIRouter(prefix="/api", tags=["chatbot"])

@router.post("/chat", response_model=ChatbotResponse)
async def chat(request: ChatbotRequest):
    try:
        response_text = await get_gemini_response(request.query, request.language)
        return ChatbotResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")

@router.post("/simplify", response_model=ChatbotResponse)
async def simplify(request: ChatbotRequest):
    try:
        prompt = f"Explain the following more simply and add an example. {request.query}"
        response_text = await get_gemini_response(prompt, request.language)
        return ChatbotResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing simplify: {str(e)}")

@router.post("/advance", response_model=ChatbotResponse)
async def advance(request: ChatbotRequest):
    try:
        prompt = f"Explain the following in more advanced and detailed terms. {request.query}"
        response_text = await get_gemini_response(prompt, request.language)
        return ChatbotResponse(response=response_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing advance: {str(e)}")