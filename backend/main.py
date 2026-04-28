from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import os, json
from dotenv import load_dotenv

load_dotenv()
# Configure with your key
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

# Permissive CORS to bridge Frontend and Backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate")
async def generate_path(data: dict):
    user_skill = data.get("current")
    target_job = data.get("target")

    # Use 'gemini-1.5-flash' - it is the most reliable model name
    model = genai.GenerativeModel('gemini-robotics-er-1.5-preview')
    
    prompt = f"Create a 4-step career roadmap for {user_skill} to become {target_job}. Return ONLY a JSON object with a 'roadmap' key containing a list of 4 objects with keys: title, description, weeks, difficulty."

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean up any markdown formatting from the AI
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0].strip()
        elif "```" in text:
            text = text.split("```")[1].split("```")[0].strip()
            
        return json.loads(text)
    except Exception as e:
        print(f"Error: {e}")
        return {"roadmap": [{"title": "Error", "description": str(e), "weeks": 0, "difficulty": 0}]}