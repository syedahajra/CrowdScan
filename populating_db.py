import psycopg2
import base64
import numpy as np
import os
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import io
from PIL import Image, ImageFile

ImageFile.LOAD_TRUNCATED_IMAGES = True

# PostgreSQL Connection Details
DB_CONFIG = {
    "dbname": "crowdscan",
    "user": "rohan",
    "password": "",
    "host": "localhost",
    "port": "5432"
}

conn = psycopg2.connect(**DB_CONFIG)
cur = conn.cursor()

# Load ArcFace Model
arcface_model = load_model("crowdscan_be/fr_models/arcface.h5")


# Function to read image & extract features
def process_image(image_path):
    img = Image.open(image_path).convert("RGB")
    img = img.resize((112, 112)) 
    img = np.array(img) / 255.0  
    img = np.expand_dims(img, axis=0) 
    
    features = arcface_model.predict(img)[0]  # Extract feature vector
    return features.tolist()

def encode_image_to_base64(image_path):
    """Reads an image, resizes it, and encodes it as a Base64 string."""
    
    # Open image and resize to (112, 112) for ArcFace
    image = Image.open(image_path)
    image = image.resize((112, 112))
    
    # Convert image to bytes
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")  # Save as PNG format in memory
    image_bytes = buffer.getvalue()  # Get raw byte data
    
    # Convert bytes to Base64 string
    base64_str = base64.b64encode(image_bytes).decode("utf-8")
    
    return base64_str

# Function to insert user data into PostgreSQL
def insert_user(name, image_path, cnic):
    features = process_image(image_path)
    image_base64 = encode_image_to_base64(image_path)
    address = "Unknown"

    # Convert feature vector to bytes
    
    cur.execute(
        "INSERT INTO users_user (name, address, image, cnic_number, feature_vector) VALUES (%s, %s, %s, %s, %s)",
        (name, address, image_base64, cnic, features)
    )
    
    conn.commit()
    print(f"User {name} added successfully!")

# Main Execution
if __name__ == "__main__":
    images_path = "All Individuals/"
    cnic = 4534123413662
    extensions = ['jpg', 'jpeg', 'webp', 'png']
    cont = False
    for username in os.listdir(images_path):
        image_folder = os.path.join(images_path, username)
        if not os.path.isdir(image_folder):
            continue
        user_num = 1
        for files in os.listdir(image_folder):
            image_path = os.path.join(image_folder, files)
            if os.path.isdir(image_path):
                continue
            if image_path.split('.')[1].lower() not in extensions:
                continue
            if cont: 
                insert_user(username + "_" + str(user_num), image_path, cnic)
            cnic += 1
            user_num += 1
            if username + "_" + str(user_num) == "Faisal Qureshi_40":
                cont = True
    cur.close()
    conn.close()
