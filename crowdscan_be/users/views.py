from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.models import User
from users.utils import extract_features, find_users


class CreateUserView(APIView):
    def post(self, request):
        name = request.data.get('name')
        address = request.data.get('address')
        cnic = request.data.get('cnic')
        encoded_img = request.data.get('image') # Get a base64 encoded image str 
       
        if not encoded_img:
           return Response({"error": "Image is Required."}, status=status.HTTP_400_BAD_REQUEST)
       
        feature_vector = extract_features(encoded_img)
        User.objects.create(
           name=name,
           address=address,
           cnic_number=cnic,
           image=encoded_img,
           feature_vector=feature_vector
        )
        return Response({"message": "User added Successfully."}, status=status.HTTP_200_OK)

class FindUserView(APIView):
    def get(self, request):
        encoded_img = request.query_params.get('image')
        threshold = request.query_params.get('threshold')
        
        if not encoded_img:
            return Response({"error": "Query Image is Required."}, status=status.HTTP_400_BAD_REQUEST)
        
        similar_users = find_users(encoded_img, threshold)
        return Response({"similar_users": similar_users}, status=status.HTTP_200_OK)