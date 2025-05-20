from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

load_dotenv()

CLERK_PEM = os.getenv("CLERK_PEM")
if CLERK_PEM and "\\n" in CLERK_PEM:
    CLERK_PEM = CLERK_PEM.replace("\\n", "\n")

security = HTTPBearer()

async def verify_clerk_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, CLERK_PEM, algorithms=["RS256"])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError as e:
        print("JWTError:", e)
        raise HTTPException(status_code=401, detail="Invalid token")