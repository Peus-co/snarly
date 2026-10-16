from fastapi import FastAPI, Depends , HTTPException,UploadFile,Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import inspect
from typing import List
from Embedding import get_Embedding , Save_chunks
from llm  import get_answer , get_title
from retrievel import Search_Chunks
import requests
from Chunks import Chunk_Text
from text_extrect import  Extrect_all_Pdfs
from database import engine,get_db,Base
from schemas import SignupData, LoginData
from auth import get_current_user, supabase
from models import Chat, Message

Base.metadata.create_all(bind=engine)

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://x12-phi.vercel.app", "https://x12-z9tw.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message":"running"}



@app.post("/signup")
def signup(data: SignupData):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password,
            "options": {
                "data": {"name": data.name}
            }
        })
        return {"Message": "Signup Successful", "user": response.user}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))




@app.post("/login")
def login(data: LoginData):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": data.email,
            "password": data.password
        })
        return {
            "access_token": response.session.access_token,
            "user": {"id": response.user.id, "email": response.user.email, "name": response.user.user_metadata.get("name", "")}
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


@app.get("/profile")
def profile(current_user:dict =Depends(get_current_user)):
    return {"user":current_user}


@app.post("/chat")
async def chat(
    prompt: str = Form(...),
    chat_id: int = Form(None),
    files: List[UploadFile] = None, 
    db: Session = Depends(get_db), 
    user=Depends(get_current_user)
):
    # Create new chat if no chat_id provided
    if chat_id is None:
        chat = Chat(user_id=user["user_id"], title="New Chat")
        db.add(chat)
        db.commit()
        db.refresh(chat)
        chat_id = chat.id
    
    combined_text = ""
    if files:
        extracted = Extrect_all_Pdfs(files)
        for filename, text in extracted.items():
            combined_text += f"\n\n --- {filename} ---\n{text}"
        chunks = Chunk_Text(combined_text)
        embeddings = [get_Embedding(c) for c in chunks]
        Save_chunks(chunks, embeddings, "uploaded_pdfs")

    retrievel_results = Search_Chunks(prompt)
    retrieved_text = "\n\n".join(retrievel_results["documents"][0])
    answer = get_answer(retrieved_text, prompt)

    existing_count = db.query(Message).filter(Message.chat_id == chat_id).count()
    if existing_count == 0:
        chat = db.query(Chat).filter(Chat.id == chat_id).first()
        print(f"DEBUG: chat_id: {chat_id}, chat object: {chat}")
        if chat:
            chat.title = get_title(prompt)
            db.commit()

    db.add(Message(chat_id=chat_id, role="user", content=prompt))
    db.add(Message(chat_id=chat_id, role="ai", content=answer))
    db.commit()

    return {"answer": answer, "chat_id": chat_id}



@app.delete("/chats/{chat_id}")
def delete_chat(chat_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == user["user_id"]).first()
    if chat:
        db.delete(chat)
        db.commit()
    return {"message": "deleted"}



@app.post("/chats")
def create_chat(db: Session = Depends(get_db), user=Depends(get_current_user)):
    chat = Chat(user_id=user["user_id"], title="New Chat")
    db.add(chat)
    db.commit()
    db.refresh(chat)
    return {"id": chat.id, "title": chat.title}

@app.get("/chats")
def get_chats(db: Session = Depends(get_db), user=Depends(get_current_user)):
    chats = db.query(Chat).filter(Chat.user_id == user["user_id"]).order_by(Chat.id.desc()).all()
    return [{"id": c.id, "title": c.title} for c in chats]

@app.get("/chats/{chat_id}/messages")
def get_messages(chat_id: int, db: Session = Depends(get_db), user=Depends(get_current_user)):
    msgs = db.query(Message).filter(Message.chat_id == chat_id).order_by(Message.id.asc()).all()
    return [{"role": m.role, "content": m.content} for m in msgs]
    
