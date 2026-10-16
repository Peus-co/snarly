import requests

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InBpeXVzaDIzQGdtYWlsLmNvbSIsImV4cCI6MTc4NTE5NjczOH0.kePFxq6h467syuGVEFcUKAF-xRGKKP4pPzVUO6MvPRA"

response = requests.get(
    "http://localhost:8000/profile",
    headers={"authorization": f"Bearer {token}"}
)

print(response.status_code)
print(response.json())