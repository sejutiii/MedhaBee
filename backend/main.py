from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config.database import get_database
from app.api.auth import router as auth_router
from app.api.chatbot import router as chatbot_router
from app.api.tts import router as tts_router
from app.api.stt import router as stt_router

app = FastAPI()

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="."), name="static")

# Include authentication routes
app.include_router(auth_router)
app.include_router(chatbot_router) 
app.include_router(tts_router)
app.include_router(stt_router)

@app.get("/")
def read_root():
    db = get_database()
    collections = db.list_collection_names()
    return {"message": "Connected to MongoDB!", "collections": collections}