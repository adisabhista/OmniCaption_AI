import os
import json
import io
import time
import google.generativeai as genai
from dotenv import load_dotenv
from PIL import Image

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

genai.configure(api_key=API_KEY)

# Initialize the model
# Strict requirement: gemini-3-pro-preview
model = genai.GenerativeModel('gemini-3-pro-preview')

async def generate_captions(topic: str, tone: str, image_bytes: bytes = None) -> dict:
    """
    Generates social media captions based on topic, tone, and optional image.
    """
    
    system_prompt = f"""
    You are an expert Social Media Manager for the Indonesian market.
    
    1. Analyze the Inputs:
       - Topic/Text: "{topic}" (Context/Intent)
       - Image: [Provided] (Analyze visual details: lighting, mood, objects, setting)
    
    2. Target Language: **Bahasa Indonesia** (Native/Natural).
    3. Selected Tone: "{tone}".
    
    4. Platform Rules:
       - **X (Twitter):** Short (< 280 chars), punchy, conversational. Use "Bahasa Twitter" (e.g., "Nder", "Guys", lowercase aesthetic) if tone is casual. No hashtags in the body.
       - **LinkedIn:** Professional, corporate-friendly, structured. Use "Bahasa Baku" but modern. Include a hook, body with bullet points, and a conclusion/CTA (e.g., "Ajak diskusi").
       - **Instagram:** Friendly, engaging, storytelling style. Use "Bahasa Gaul/Santai". Emoji-rich. Include a block of 15-30 hashtags relevant to Indonesia (e.g., #fyp #indonesia) at the bottom.
       - **YouTube:** SEO optimized title (Clickbait but honest) & comprehensive description in Indonesian.

    5. Output Format: Return **ONLY** a raw JSON object with the following keys: "twitter", "linkedin", "instagram", "youtube".
    Do not include markdown formatting (like ```json) in the response, just the raw JSON string.
    """

    generation_config = genai.GenerationConfig(
        temperature=0.7,
        response_mime_type="application/json"
    )

    try:
        contents = [system_prompt]
        if image_bytes:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Optimization: Resize if too large (max 1024px)
            max_size = 1024
            if max(image.size) > max_size:
                ratio = max_size / max(image.size)
                new_size = (int(image.width * ratio), int(image.height * ratio))
                image = image.resize(new_size, Image.Resampling.LANCZOS)
            
            # Optimization: Convert to RGB (remove alpha channel if PNG) to reduce size
            if image.mode != 'RGB':
                image = image.convert('RGB')
                
            contents.append(image)

        start_time = time.time()
        print(f"Sending request to Gemini... (Image present: {bool(image_bytes)})")

        response = await model.generate_content_async(
            contents,
            generation_config=generation_config
        )
        
        end_time = time.time()
        print(f"Gemini response received in {end_time - start_time:.2f} seconds")
        
        # Parse JSON response
        try:
            parsed = json.loads(response.text)
            # Ensure all values are strings to prevent frontend crashes
            sanitized = {}
            for key in ["twitter", "linkedin", "instagram", "youtube"]:
                val = parsed.get(key, "")
                if isinstance(val, dict):
                    # If it's a dict, try to find a 'caption' key or dump it to string
                    sanitized[key] = val.get("caption", str(val))
                elif isinstance(val, list):
                    sanitized[key] = "\n".join(map(str, val))
                else:
                    sanitized[key] = str(val)
            return sanitized
        except json.JSONDecodeError:
            # Fallback if raw text isn't perfect JSON
            text = response.text.replace("```json", "").replace("```", "").strip()
            try:
                parsed = json.loads(text)
                sanitized = {}
                for key in ["twitter", "linkedin", "instagram", "youtube"]:
                    val = parsed.get(key, "")
                    if isinstance(val, dict):
                        sanitized[key] = val.get("caption", str(val))
                    elif isinstance(val, list):
                        sanitized[key] = "\n".join(map(str, val))
                    else:
                        sanitized[key] = str(val)
                return sanitized
            except:
                # Ultimate fallback: return raw text in one field
                return {
                    "twitter": "Error parsing",
                    "linkedin": text,
                    "instagram": "Error parsing",
                    "youtube": "Error parsing"
                }
            
    except Exception as e:
        print(f"Error generating content: {e}")
        import traceback
        traceback.print_exc()
        raise e
