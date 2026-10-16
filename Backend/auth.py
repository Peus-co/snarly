import os
from pathlib import Path
from supabase import create_client, Client
from fastapi import Header, HTTPException

env_file = Path(__file__).parent / ".env"

if env_file.exists():
    for line in env_file.read_text(encoding="utf-8-sig").splitlines(): # 'utf-8-sig' automatically handles BOM!
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ[k.strip()] = v.strip()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SECRET_KEY = os.environ.get("SUPABASE_SECRET_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SECRET_KEY)

def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    token = authorization.replace("Bearer ", "")
    
    try:
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"user_id": user.id, "email": user.email, "name": user.user_metadata.get("name", "")}
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Authentication failed: {str(e)}")

