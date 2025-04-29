from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User
from users.utils import extract_features, find_users

MODELS = ["VGG-Face", "ArcFace", "SFace"]
class CreateUserView(APIView):
    def post(self, request):
        name = request.data.get('name', "Unknown")
        address = request.data.get('address', "NA")
        cnic = request.data.get('cnic', "NA")
        encoded_images = request.data.get('images', [])
       
        if not encoded_images:
           return Response({"error": "Image is Required."}, status=status.HTTP_400_BAD_REQUEST)
        for encoded_img in encoded_images:
            for model in MODELS:
                feature_vector = extract_features(encoded_img, model_name=model)
                User.objects.create(
                    name=name,
                    cnic_number=cnic,
                    address=address,
                    image=encoded_img,
                    feature_vector=feature_vector,
                    type=model
                )
        return Response({"message": "User added Successfully.", "name": name}, status=status.HTTP_201_CREATED)
class FindUserView(APIView):
    def post(self, request):
        encoded_img = request.data.get('image')
        threshold = request.data.get('threshold')
        if not encoded_img:
            return Response({"error": "Query Image is Required."}, status=status.HTTP_400_BAD_REQUEST)
        
        similar_users = find_users(encoded_img, threshold)
        return Response({"similar_users": similar_users}, status=status.HTTP_200_OK)

class CreateBulkUsersView(APIView):
    def post(self, request):
        encoded_images = request.data.get('images', [])
        if not encoded_images:
            return Response({"error": "Images are Required."}, status=status.HTTP_400_BAD_REQUEST)
        
        for image in encoded_images:
            for model in MODELS:
                feature_vector = extract_features(image, model_name=model)
                User.objects.create(
                    name="Unknown",
                    cnic_number="NA",
                    address="NA",
                    image=image,
                    feature_vector=feature_vector,
                    type=model
                )
        return Response({"message": "Users added Successfully."}, status=status.HTTP_201_CREATED)
        