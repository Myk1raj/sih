from flask import Flask, request, render_template, redirect, url_for
from transformers import Qwen2VLForConditionalGeneration, AutoProcessor
from PIL import Image
import os
import torch
import shutil

app = Flask(__name__)

# Configure the upload folder and allowed extensions
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Initialize the model and processor
model = Qwen2VLForConditionalGeneration.from_pretrained(
    "Qwen/Qwen2-VL-2B-Instruct",
    torch_dtype="auto",
    device_map="auto",
)
processor = AutoProcessor.from_pretrained("Qwen/Qwen2-VL-2B-Instruct")

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def start():
    return render_template('start.html')
@app.route('/home')
def home():
    return render_template('home.html')
@app.route('/model', methods=['GET', 'POST'])
def model_view():
    if request.method == 'POST':
        if 'image' not in request.files:
            return redirect(request.url)
        file = request.files['image']
        if file.filename == '':
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = 'uploaded_image.png'  # Save with a unique or original filename
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)

            # Process the image and get predictions
            image = Image.open(filepath)

            messages = [
                {
                    "role": "user",
                    "content": [
                        {"type": "image"},
                        {"type": "text", "text": "give me all the information in the picture as key value pairs"}
                    ]
                }
            ]

            text_prompt = processor.apply_chat_template(messages, add_generation_prompt=True)

            inputs = processor(
                text=[text_prompt],
                images=[image],
                padding=True,
                return_tensors="pt"
            )

            inputs = inputs.to("cuda")

            output_ids = model.generate(**inputs, max_new_tokens=1024)

            generated_ids = [
                output_ids[len(input_ids):]
                for input_ids, output_ids in zip(inputs.input_ids, output_ids)
            ]

            output_text = processor.batch_decode(
                generated_ids, skip_special_tokens=True, clean_up_tokenization_spaces=True
            )

            return render_template("output.html", prediction_text=output_text)

    return render_template('model.html')

if __name__ == '__main__':
    # Check if the uploads folder exists
    if os.path.exists(UPLOAD_FOLDER):
        # Delete the folder and its contents
        shutil.rmtree(UPLOAD_FOLDER)
    
    # Create the uploads folder
    os.makedirs(UPLOAD_FOLDER)
    
    app.run(debug=True)
