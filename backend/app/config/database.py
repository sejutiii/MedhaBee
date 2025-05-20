from pymongo import MongoClient
from urllib.parse import urlparse
from dotenv import load_dotenv
import os

load_dotenv()

def get_database():
    MONGODB_URI = os.getenv("MONGODB_URI")
    parsed_uri = urlparse(MONGODB_URI)
    db_name = parsed_uri.path[1:] if parsed_uri.path and len(parsed_uri.path) > 1 else None
    if not db_name:
        db_name = os.getenv("MONGODB_DB", "test")  # Fallback to 'test'
    
    client = MongoClient(MONGODB_URI)
    return client[db_name]