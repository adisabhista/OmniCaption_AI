import asyncio
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY not found in environment variables.")
    exit(1)

genai.configure(api_key=API_KEY)

async def test_gemini():
    print("Testing Gemini 3.0 Pro Preview...")
    try:
        model = genai.GenerativeModel('gemini-3-pro-preview')
        response = await model.generate_content_async("Hello, are you Gemini 3.0?")
        print(f"Response: {response.text}")
        print("Success! Gemini 3.0 is accessible.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_gemini())
