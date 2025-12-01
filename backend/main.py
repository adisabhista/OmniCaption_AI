from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.ai_service import generate_captions
import uvicorn

app = FastAPI(title="OmniCaption AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/generate")
async def generate_captions_endpoint(
    topic: str = Form(None),
    tone: str = Form(...),
    image: UploadFile = File(None)
):
    print(f"Endpoint hit! Topic: {topic}, Tone: {tone}, Image: {image}")
    try:
        image_bytes = None
        if image:
            image_bytes = await image.read()
        
        # Ensure topic is not None if no image provided (or handle in service)
        if not topic and not image_bytes:
            return {"error": "Either topic or image must be provided"}
            
        return await generate_captions(topic or "", tone, image_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "model": "gemini-3-pro-preview"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
