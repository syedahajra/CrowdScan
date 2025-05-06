from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User, Features, Administrators, ScanHistory
from users.serializers import AdministratorSerializer, ScanHistorySerializer
from users.utils import extract_features, find_users

MODELS = ["VGG-Face", "ArcFace", "SFace"]
class CreateUserView(APIView):
    def post(self, request):
        name = request.data.get('name')
        address = request.data.get('address')
        cnic = request.data.get('cnic')
        encoded_images = request.data.get('images', [])
       
        if not encoded_images:
           return Response({"error": "Image is Required."}, status=status.HTTP_400_BAD_REQUEST)
        for encoded_img in encoded_images:
            try:
                user_obj = User.objects.create(
                    name = name,
                    address = address,
                    cnic_number = cnic,
                    image = encoded_img
                )
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
            for model in MODELS:
                feature_vector = extract_features(encoded_img, model_name=model)
                Features.objects.create(
                    user = user_obj,
                    feature_vector = feature_vector,
                    model_name = model
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


class CreateAdminView(APIView):
    serializer_class = AdministratorSerializer
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Admin created successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class GetScanHistoryView(APIView):
    def get(self, request):
        queryset = ScanHistory.objects.all(scanned_by=request.user)
        serializer = ScanHistorySerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)