import io
import base64
from PIL import Image, ImageFile
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.metrics.pairwise import cosine_similarity

from users.models import User

MODEL_PATH = './fr_models/arcface_2.h5'
ImageFile.LOAD_TRUNCATED_IMAGES = True

def preprocess_image(encoded_image):
    try:
        image_bytes = base64.b64decode(encoded_image)
        image = Image.open(io.BytesIO(image_bytes))
        image = image.resize((112, 112))
        image_array = np.array(image) / 255.0
        image_array = np.expand_dims(image_array, axis=0)
        return image_array
    except Exception as e:
        print("Error in preprocess_image:", str(e))
        raise ValueError("Invalid Base64 image data")

def extract_features(encoded_image):
    arcface_model = load_model(MODEL_PATH)
    image = preprocess_image(encoded_image=encoded_image)
    features = arcface_model.predict(image)[0]
    return features.tolist()

def find_users(encoded_image, threshold):
    if not threshold:
        threshold = 0.5
    
    query_features = np.array(extract_features(encoded_image=encoded_image)).reshape(1, -1)
    users = User.objects.exclude(feature_vector=None)
    similar_users = []
    
    for user in users:
        stored_features = np.array(user.feature_vector).reshape(1, -1)
        similarity = cosine_similarity(query_features, stored_features)[0][0]
        
        if similarity >= threshold:
            similar_users.append({
                "name": user.name,
                "address": user.address,
                "cnic_number": user.cnic_number,
                "image": user.image,
                "similarity": similarity
            })
    return similar_users