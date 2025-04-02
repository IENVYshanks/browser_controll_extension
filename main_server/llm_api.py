from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import ollama
from PIL import Image
import base64

app = FastAPI()

# Allow all origins, methods, and headers for CORS (e.g., Chrome Extensions)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow Chrome Extensions
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process")
async def process_request(
    text: str = Form(...), 
    file: UploadFile = File(None)  # File is optional
):
    file_info = "No file uploaded"
    image_base64 = None

    # If a file is uploaded
    if file:
        image_data = await file.read()
        image = BytesIO(image_data) 
        
        
        # Convert the image to base64
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
       

    # Format the prompt for Ollama (including the base64 image if available)
    prompt = f"{text} "
    if image_base64:
        response = ollama.chat(
        model="gemma3:4b",
        messages=[{"role": "user", "prompt": prompt,"images":[image_base64]},]
    )
    else:
        response = ollama.chat(
        model="gemma3:4b",
        messages=[{"role": "user", "prompt": prompt}]
        )
    
    

    return {"response": response["message"]["content"]}

