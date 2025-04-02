import ollama
from io import BytesIO
import base64
from PIL import Image

# Simulating file upload, assuming `file` is an UploadFile object
filename = 'random.png'
content_type = 'image/png'

# Open the image file
file = Image.open(r'C:\Users\sawai\Desktop\browser_control\browser_controll_extension\main_server\random.png')

# Create a BytesIO buffer to hold the image data
buffered = BytesIO()
file.save(buffered, format="PNG")
buffered.seek(0)  # Go to the start of the BytesIO buffer

# Simulating file info
file_info = f"Received file: {filename} ({content_type})"

# Optionally show the image (for server-side purposes, not required in production)
# file.show()

# Convert the image to base64
image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")
# print(image_base64)
# Simulated user input text (replace with actual input from the user)
text = "This is a test prompt with an image."

# Prepare the prompt including base64 image data
# prompt = f"User input: {text}\n{file_info}\nImage data (base64): {image_base64}"

# Send the request to Ollama
response = ollama.chat(
    model="gemma3:4b",
    messages=[{"role": "user", "prompt": "describe","images": [image_base64]}],
    stream=True,
)

# Print the response
for chunk in response:
    print(chunk["message"]["content"], end="", flush=True)
