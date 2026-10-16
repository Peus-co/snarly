from sentence_transformers import  SentenceTransformer

import chromadb


model =SentenceTransformer("all-MiniLM-L6-v2")

client =chromadb.PersistentClient(path="./chroma_db")

collection = client.get_or_create_collection(name="pdf_chunks")


def get_Embedding(text):
    embeddings = model.encode(text)
    return embeddings


def Save_chunks(chunks,embeddings,filename):
    ids = [f"{filename}_{i}" for i  in range(len(chunks))]
    
    
    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=chunks,
        metadatas=[{"source":filename} for _ in chunks]
    )