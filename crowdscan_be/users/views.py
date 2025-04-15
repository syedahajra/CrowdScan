from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User
from users.serializers import UserSerializer
from users.utils import extract_features, find_users

MODELS = ["VGG-Face", "ArcFace", "SFace"]
class CreateUserView(APIView):
    serializer = UserSerializer
    def post(self, request):
        name = request.data.get('name')
        address = request.data.get('address')
        cnic = request.data.get('cnic')
        encoded_img = request.data.get('image') # Get a base64 encoded image str
       
        if not encoded_img:
           return Response({"error": "Image is Required."}, status=status.HTTP_400_BAD_REQUEST)
        
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
            cnic+=1
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
        users = request.data.get('users')
        pass