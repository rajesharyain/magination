from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
from fastapi.templating import Jinja2Templates
from fastapi import Request
import tempfile
import os
import json
from typing import Dict, List, Optional
from pydantic import BaseModel
from gtts import gTTS
import uuid

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
os.makedirs("uploads", exist_ok=True)
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Templates
templates = Jinja2Templates(directory="templates")

# Available languages and their codes
LANGUAGES = {
    "English": "en",
    "Spanish": "es",
    "French": "fr",
    "German": "de",
    "Italian": "it",
    "Portuguese": "pt",
    "Polish": "pl",
    "Turkish": "tr",
    "Russian": "ru",
    "Dutch": "nl",
    "Czech": "cs",
    "Arabic": "ar",
    "Chinese": "zh-cn",
    "Japanese": "ja",
    "Korean": "ko"
}

# Enhanced emotion controls (simplified for gTTS)
EMOTIONS = {
    "neutral": {
        "speed": 1.0
    },
    "happy": {
        "speed": 1.2
    },
    "sad": {
        "speed": 0.8
    },
    "angry": {
        "speed": 1.4
    },
    "fearful": {
        "speed": 1.3
    },
    "disgust": {
        "speed": 0.9
    },
    "surprised": {
        "speed": 1.5
    }
}

class TTSRequest(BaseModel):
    text: str
    language: str = "en"
    emotion: str = "neutral"
    speed: float = 1.0

def adjust_emotion_parameters(base_emotion: str, speed: float) -> Dict:
    """Adjust emotion parameters based on base emotion and user controls."""
    base_params = EMOTIONS[base_emotion].copy()
    return {
        "speed": base_params["speed"] * speed
    }

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/api/generate-audio")
async def generate_audio(request: TTSRequest):
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text is required")

        # Generate a unique filename
        filename = f"{uuid.uuid4()}.mp3"
        output_path = os.path.join("uploads", filename)

        # Create gTTS object
        tts = gTTS(
            text=request.text,
            lang=request.language,
            slow=False
        )

        # Save the audio file
        tts.save(output_path)

        return {
            "success": True,
            "audioUrl": f"/uploads/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/process-script")
async def process_script(script: UploadFile = File(...)):
    try:
        if not script.filename.endswith('.json'):
            raise HTTPException(status_code=400, detail="Only JSON files are allowed")

        # Read and parse the script
        content = await script.read()
        scenes = json.loads(content)
        audio_files = []

        for scene in scenes:
            # Generate a unique filename
            filename = f"{uuid.uuid4()}.mp3"
            output_path = os.path.join("uploads", filename)

            # Create gTTS object
            tts = gTTS(
                text=scene["text"],
                lang=LANGUAGES[scene.get("language", "English")],
                slow=False
            )

            # Save the audio file
            tts.save(output_path)

            audio_files.append({
                "scene": scene,
                "audioUrl": f"/uploads/{filename}"
            })

        return {
            "success": True,
            "audioFiles": audio_files
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/languages")
async def get_languages():
    return LANGUAGES

@app.get("/api/emotions")
async def get_emotions():
    return EMOTIONS

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001) 