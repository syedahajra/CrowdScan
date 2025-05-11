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

def find_users(encoded_images, threshold):
    all_results = []
    
    for encoded_image in encoded_images:
        occ_per = get_occlusion_percentage(decode_image(encoded_image))
        
        query_features_arc = np.array(extract_features(encoded_image=encoded_image, model_name="ArcFace")).reshape(1, -1)
        query_features_vgg = np.array(extract_features(encoded_image=encoded_image, model_name="VGG-Face")).reshape(1, -1)
        query_features_sf= np.array(extract_features(encoded_image=encoded_image, model_name="SFace")).reshape(1, -1)
        
        
        features_arc = Features.objects.filter(model_name="ArcFace").exclude(feature_vector=None)
        features_sf = Features.objects.filter(model_name="SFace").exclude(feature_vector=None)
        features_vgg = Features.objects.filter(model_name="VGG-Face").exclude(feature_vector=None)
        
        
        similar_users = []
        matched_users = set()

        # Process ArcFace results
        if not threshold:
            threshold = thresholds["ArcFace"]
        
        for feature in features_arc:
            stored_features = np.array(feature.feature_vector).reshape(1, -1)
            similarity = cosine_similarity(query_features_arc, stored_features)[0][0]
            if similarity >= threshold:
                user = User.objects.get(id=feature.user.id)
                matched_users.add(user.id)
                similar_users.append({
                    "name": user.name,
                    "address": user.address, 
                    "cnic_number": user.cnic_number,
                    "image": user.image,
                    "similarity": similarity,
                    "model_used": "ArcFace",
                    "occlusion_percentage": occ_per,
                    "matched_models": set(["ArcFace"]) 
                })

        if not threshold:
            threshold = thresholds["VGG-Face"]
        
        for feature in features_vgg:
            stored_features = np.array(feature.feature_vector).reshape(1, -1)
            similarity = cosine_similarity(query_features_vgg, stored_features)[0][0]
            if similarity >= threshold:
                user = User.objects.get(id=feature.user.id)
                if user.id in matched_users:
                    for entry in similar_users:
                        if entry["image"] == user.image:
                            entry["matched_models"].add("VGG-Face")
                            entry["similarity"] = max(entry["similarity"], similarity)
                else:
                    matched_users.add(user.id)
                    similar_users.append({
                        "name": user.name,
                        "address": user.address,
                        "cnic_number": user.cnic_number,
                        "image": user.image,
                        "similarity": similarity,
                        "model_used": "VGG-Face",
                        "occlusion_percentage": occ_per,
                        "matched_models": set(["VGG-Face"])  # Using set for unique models
                    })

        if not threshold:
            threshold = thresholds["SFace"]
            
        for feature in features_sf:
            stored_features = np.array(feature.feature_vector).reshape(1, -1)
            similarity = cosine_similarity(query_features_sf, stored_features)[0][0]
            if similarity >= threshold:
                user = User.objects.get(id=feature.user.id)
                if user.id in matched_users:
                    for entry in similar_users:
                        if entry["image"] == user.image:
                            entry["matched_models"].add("SFace")  # Add to set
                            entry["similarity"] = max(entry["similarity"], similarity)
                else:
                    matched_users.add(user.id)
                    similar_users.append({
                        "name": user.name,
                        "address": user.address,
                        "cnic_number": user.cnic_number,
                        "image": user.image,
                        "similarity": similarity,
                        "model_used": "SFace", 
                        "occlusion_percentage": occ_per,
                        "matched_models": set(["SFace"])  # Using set for unique models
                    })

        # Convert sets to lists before sorting
        for user in similar_users:
            user["matched_models"] = list(user["matched_models"])

        # Sort by number of matched models first, then by similarity
        similar_users = sorted(similar_users, key=lambda x: (len(x["matched_models"]), x["similarity"]),  reverse=True)

        all_results.append({
            "image_index": len(all_results),
            "query_image": encoded_image,
            "matches": similar_users[:min(len(similar_users), 20)]
        })
    return all_results
