import requests
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.environ.get("FREE_LLM_API_KEY")
BASE_URL = os.environ.get("FREE_LLM_BASE_URL", "http://127.0.0.1:31415/v1")

def test_llm():
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "auto",
        "messages": [
            {"role": "user", "content": "Hello, are you working?"}
        ]
    }
    print(f"Testing URL: {BASE_URL}/chat/completions")
    try:
        response = requests.post(f"{BASE_URL}/chat/completions", json=payload, headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_llm()
