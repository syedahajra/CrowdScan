# CrowdScan 👁️‍🗨️
🌐 [Live Demo](https://crowdscan-fe.vercel.app/)

## Demo Video
Watch the demo of CrowdScan (Facial Recognition System) here:
(https://drive.google.com/file/d/16fcxGoQoAo9weHQLPLGfK4V4-68TcFFK/view?usp=sharing)

CrowdScan is a lightweight and efficient facial recognition system built using Python, Nextjs and the DeepFace library. Designed to assist law enforcement agencies, it enables fast and contactless suspect identification by matching faces against an existing database.

## 🚀 Features

- 🔍 **Face Verification & Recognition**  
  Perform face matching using pre-trained DeepFace models (VGG-Face, Sface, ArcFace).
  Arcface model was further trained on our curated dataset of 1400 images of 35 different individuals in challenging situations (occlusion, age invariance, crowd).

- 📷 **Support for Image Uploads**  
  Upload suspect photos or ID card images for identity verification.

- 📊 **Model Comparison Dashboard**  
  View performance metrics (accuracy, speed, occlusion handling) across different models.

- 🌐 **Web-Based Interface**  
  Simple and user-friendly frontend for officers or administrators to interact with the system.

-⚙️ **Adjustable Threshold Sensitivity**  
  Users can set a custom similarity threshold to adjust recognition sensitivity (e.g., for stricter or more lenient matches).

-👥 **Role-Based Access Control**  
  Supports multiple user types:
  - **Administrators**: Full access, including user management (e.g., adding managers)
  - **Officers**: Operational access to recognition tools, but no user creation rights

- 🧠 **Pretrained Models**  
  No need for heavy training—uses DeepFace’s optimized backends for out-of-the-box accuracy.

---

## 🛠️ Tech Stack

- **Frontend:** Nextjs, ShadCN, lottie-react
- **Backend:** Python  
- **AI/ML Library:** DeepFace  
- **Other Tools:** OpenCV, NumPy, Pandas

---

## 📸 Models Supported

- VGG-Face  
- Sface 
- ArcFace  

Each model is benchmarked based on accuracy, inference time, and robustness to occlusion, aging, and crowd scenarios.
