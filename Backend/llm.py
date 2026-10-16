import os
import httpx
from pathlib import Path
from openai import OpenAI

env_file = Path(__file__).parent / ".env"
if env_file.exists():
    for line in env_file.read_text(encoding="utf-8-sig").splitlines():
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            os.environ[k.strip()] = v.strip()

API_KEY = (os.environ.get("FREELLMAPI_API_KEY") or os.environ.get("FREE_LLM_API_KEY") or "").strip()
BASE_URL = (os.environ.get("FREE_LLM_BASE_URL") or "http://127.0.0.1:31415/v1").strip()

# trust_env=False: ignore system HTTP_PROXY / ALL_PROXY (e.g. a SOCKS proxy on :1080)
# so requests to the local FreeLLMAPI server at 127.0.0.1 are never routed through it.
client = OpenAI(
    api_key=API_KEY,
    base_url=BASE_URL,
    http_client=httpx.Client(trust_env=False, timeout=httpx.Timeout(120.0, connect=10.0)),
)

def get_answer(context, prompt):
    try:
        response = client.chat.completions.create(
            model="auto",
            messages=[
                {"role": "system", "content": "You are a helpful AI assistant that answers questions based on the provided context."},
                {"role": "user", "content": f"Context:\n{context}\n\nQuestion: {prompt}"}
            ],
            temperature=0.7
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"Error contacting LLM API: {str(e)}"


def get_title(prompt):
    try:
        response = client.chat.completions.create(
            model="auto",
            messages=[
                {"role": "user", "content": f"Summarize this in 3 to 5 words, as a short chat title, no punctuation, no quotes:\n\n{prompt}"}
            ],
            temperature=0.5
        )
        return response.choices[0].message.content.strip()
    except Exception:
        return "New Chat"