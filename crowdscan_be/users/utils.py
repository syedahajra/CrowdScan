import base64
import numpy as np
import cv2
from PIL import ImageFile
import numpy as np
from tensorflow.keras.models import load_model
from sklearn.metrics.pairwise import cosine_similarity
from deepface import DeepFace
from users.models import Features, User
from crowdscan_be.Utils.occlusion_detector import FaceOcclusionDetector

ImageFile.LOAD_TRUNCATED_IMAGES = True

arcface_finetuned = load_model("./models/arcface.h5", custom_objects=None, compile=True, safe_mode=True)
thresholds = {"SFace": 0.3, "ArcFace": 0.5,  "VGG-Face": 0.5}

def get_occlusion_percentage(image):
    occlusion_detector = FaceOcclusionDetector()
    occlusion_percentage = occlusion_detector.get_occlusion_percentage(image)
    return occlusion_percentage

def decode_image(encoded_image, model_name=None):
    try:
        image_data = base64.b64decode(encoded_image)
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        if model_name == "ArcFace":
            image = cv2.resize(image, (112, 112))
            image = image.astype("float32") / 255.0
            image = np.expand_dims(image, axis=0)
        return image
    except Exception as e:
        print("Error in preprocess_image:", str(e))
        raise ValueError("Invalid Base64 image data")

def extract_features(encoded_image, model_name="ArcFace"):
    decoded_image = decode_image(encoded_image, model_name=model_name)
    if model_name == "ArcFace":
        features = arcface_finetuned.predict(decoded_image)
        features = features.tolist()
        return features[0]
    embeddings = DeepFace.represent(decoded_image, model_name=model_name, detector_backend="yolov8", enforce_detection=False)
    features = embeddings[0]['embedding']
    return features

def find_users(encoded_image, threshold):  
    model_name = "ArcFace"
    query_features = np.array(extract_features(encoded_image=encoded_image)).reshape(1, -1)
    features = Features.objects.filter(model_name=model_name).exclude(feature_vector=None)
    similar_users = []
    if not threshold:
        threshold = thresholds[model_name]
    
    for feature in features:
        stored_features = np.array(feature.feature_vector).reshape(1, -1)
        similarity = cosine_similarity(query_features, stored_features)[0][0]
        if similarity >= threshold:
            user = User.objects.get(id=feature.user.id)
            similar_users.append({
                "name": user.name,
                "address": user.address,
                "cnic_number": user.cnic_number,
                "image": user.image,
                "similarity": similarity
            })
    similar_users = sorted(similar_users, key=lambda x: x['similarity'], reverse=True)
    return similar_users[:5]
