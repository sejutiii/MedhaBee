from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.database import get_database
from app.api.auth import router as auth_router

app = FastAPI()

# Add CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication routes
app.include_router(auth_router)

@app.get("/")
def read_root():
    db = get_database()
    collections = db.list_collection_names()
    return {"message": "Connected to MongoDB!", "collections": collections}