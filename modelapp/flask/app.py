from flask import Flask, request, jsonify
from PIL import Image
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.imagenet_utils import preprocess_input
import base64
import io

app = Flask(__name__)

# Load the pre-trained CIFAR-10 model
model = load_model('labfinal_model.keras')

# Define the route for predicting an image
@app.route('/predict_image', methods=['POST'])
def predict_image():
    try:
        # Get the JSON data from the request
        data = request.get_json()
        image_base64 = data['image']

        # Convert base64 string to image
        image = Image.open(io.BytesIO(base64.b64decode(image_base64)))
        
        # Preprocess the image for the CIFAR-10 model
        img = image.resize((32, 32))  # Resize image to the model's input shape
        img_array = np.array(img)
        img_array = img_array / 255.0  # Normalize pixel values
        img_array = np.expand_dims(img_array, axis=0)

        # Make predictions using the CIFAR-10 model
        predictions = model.predict(img_array)

        # Decode predictions
        class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer', 'dog', 'frog', 'horse', 'ship', 'truck']
        predicted_class_index = np.argmax(predictions)
        predicted_class = class_names[predicted_class_index]

        return jsonify({'predicted_class': predicted_class})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='192.168.100.46', port=5000)

