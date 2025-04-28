import base64
import numpy as np
import cv2
from PIL import ImageFile
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from deepface import DeepFace
from users.models import User
from crowdscan_be.Utils.occlusion_detector import FaceOcclusionDetector

ImageFile.LOAD_TRUNCATED_IMAGES = True

def decode_image(encoded_image):
    try:
        image_data = base64.b64decode(encoded_image)
        np_arr = np.frombuffer(image_data, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return image
    except Exception as e:
        print("Error in preprocess_image:", str(e))
        raise ValueError("Invalid Base64 image data")

def extract_features(decoded_image, model_name="VGG-Face"):
    embeddings = DeepFace.represent(decoded_image, model_name=model_name, detector_backend="yolov8", enforce_detection=False)
    features = embeddings[0]['embedding']
    return features

def find_users(encoded_image, threshold):
    if not threshold:
        threshold = 0.5
    decoded_image = decode_image(encoded_image)
    occ_percen = get_occlusion_percentage(decoded_image)
    print(f"Occlusion Percentage: {occ_percen}")
    query_features = np.array(extract_features(decoded_image=decoded_image)).reshape(1, -1)
    users = User.objects.exclude(feature_vector=None)
    users = users.filter(type="VGG-Face")
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
    return similar_users.sort(key=lambda x: x['similarity'], reverse=True)


def get_occlusion_percentage(image):
    occlusion_detector = FaceOcclusionDetector()
    occlusion_percentage = occlusion_detector.get_occlusion_percentage(image)
    return occlusion_percentage