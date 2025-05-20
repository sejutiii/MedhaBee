import os
from fastapi import FastAPI
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

app = FastAPI()

# Connect to MongoDB
client = MongoClient(MONGODB_URI)
db = client.get_default_database()

@app.get("/")
def read_root():
    # Example: return the list of collections in the database
    collections = db.list_collection_names()
    return {"message": "Connected to MongoDB!", "collections": collections}
