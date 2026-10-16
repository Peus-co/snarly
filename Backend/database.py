import os 
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base

env_file = Path(__file__).parent / ".env"
if env_file.exists():
    for line in env_file.read_text(encoding="utf-8-sig").splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ[k.strip()] = v.strip()

DATABASE_URL = os.environ.get("DATABASE_URL") or "sqlite:///./chat.db"


engine =create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
Base =declarative_base()

def get_db():
    db =SessionLocal()
    try:
        yield db
    finally:
        db.close()