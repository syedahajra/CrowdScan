import os
import cv2
import numpy as np
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import mediapipe as mp

from PIL import Image
from .model import BiSeNet

# Define paths
MODEL_PATH = os.path.join(os.path.dirname(__file__), '79999_iter.pth')

# Face parsing model init
class FaceOcclusionDetector:
    def __init__(self):
        self.n_classes = 19
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.net = BiSeNet(n_classes=self.n_classes)
        self.net.to(self.device)
        self.net.load_state_dict(torch.load(MODEL_PATH, map_location=self.device))
        self.net.eval()

        self.to_tensor = transforms.Compose([
            transforms.Resize((512, 512)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.5]*3, std=[0.5]*3)
        ])

        # MediaPipe hands model
        self.mp_hands = mp.solutions.hands.Hands(static_image_mode=True, max_num_hands=2)

    def parse_face(self, image: Image.Image):
        img = self.to_tensor(image).unsqueeze(0).to(self.device)
        with torch.no_grad():
            out = self.net(img)[0]
        parsing = out.squeeze(0).cpu().numpy().argmax(0)
        return parsing

    def detect_hands(self, image_np):
        results = self.mp_hands.process(cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB))
        mask = np.zeros(image_np.shape[:2], dtype=np.uint8)
        if results.multi_hand_landmarks:
            for hand in results.multi_hand_landmarks:
                for point in hand.landmark:
                    x = int(point.x * image_np.shape[1])
                    y = int(point.y * image_np.shape[0])
                    cv2.circle(mask, (x, y), 15, 255, -1)
        return mask

    def get_occlusion_percentage(self, image_path):
        image_pil = Image.open(image_path).convert('RGB')
        image_np = cv2.imread(image_path)

        parsing = self.parse_face(image_pil)
        hand_mask = self.detect_hands(image_np)

        face_area = np.sum((parsing > 0) & (parsing != 18))  # 18 is background
        occlusion_mask = np.isin(parsing, [7, 8, 11, 12, 13, 14, 15, 16])  # hair, glasses, etc.
        occlusion_area = np.sum(occlusion_mask)

        # Add hand overlap
        resized_hand_mask = cv2.resize(hand_mask, (parsing.shape[1], parsing.shape[0]))
        occlusion_area += np.sum((resized_hand_mask > 0) & (parsing != 18))

        occlusion_percent = (occlusion_area / face_area) * 100 if face_area > 0 else 0
        return round(min(occlusion_percent, 100), 2)