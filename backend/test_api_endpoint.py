import requests

# Check Health
try:
    health = requests.get("http://localhost:8001/health", timeout=5)
    print(f"Health Check: {health.status_code} - {health.json()}")
except Exception as e:
    print(f"Health Check Failed: {e}")
    exit(1)

url = "http://localhost:8001/api/generate"
data = {
    "topic": "Tes Koneksi Backend",
    "tone": "Santai/Gaul"
}

print("Sending generation request...")
try:
    response = requests.post(url, data=data, timeout=60) # 60s timeout for test
    print(f"Status Code: {response.status_code}")
    print("Response JSON:", response.json())
except Exception as e:
    print(f"Generation Error: {e}")
