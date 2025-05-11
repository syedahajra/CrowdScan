import jwt
from django.utils import timezone
from datetime import datetime, timedelta
from django.conf import settings
from django.contrib.auth.hashers import check_password
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from administrators.models import Administrators
from administrators.serializers import AdministratorSerializer



class CreateUpdateRetrieveDeleteAdminView(APIView):
    serializer_class = AdministratorSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)  # Add this line
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, *args, **kwargs):
        try:
            admin_id = kwargs.get('pk')
            if not admin_id:
                return Response(
                    {"error": "Administrator ID is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
                
            admin = Administrators.objects.get(id=admin_id)
            
            serializer = self.serializer_class(admin, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Administrators.DoesNotExist:
            return Response(
                {"error": "Administrator not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def get(self, request, *args, **kwargs):
        admin_id = kwargs.get('pk')
        if admin_id:
            try:
                admin = Administrators.objects.get(id=admin_id)
                data = self.serializer_class(admin).data
                return Response(data, status=status.HTTP_200_OK)
            except Administrators.DoesNotExist:
                return Response({"error": "Admin not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            # Fetch all admins
            admins = Administrators.objects.all()
            data = self.serializer_class(admins, many=True).data
            return Response(data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        try:
            admin_id = kwargs.get('pk')
            if not admin_id:
                return Response(
                    {"error": "Administrator ID is required"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            admin = Administrators.objects.get(id=admin_id)
            admin.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Administrators.DoesNotExist:
            return Response(
                {"error": "Administrator not found"}, 
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
    
class AdminLoginView(APIView):
    def post(self, request):
        name = request.data.get('name')
        email = request.data.get('email')
        password = request.data.get('password')
        
        try:
            if not (name or email):
                return Response({"error": "Name or email is required"}, status=status.HTTP_400_BAD_REQUEST)
            if name:
                admin = Administrators.objects.get(name=name)
            else:
                admin = Administrators.objects.get(email=email)
            
            if not check_password(password, admin.password):  # Using check_password for secure comparison
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            
            if not admin.is_active:
                return Response({"error": "Account is disabled"}, status=status.HTTP_403_FORBIDDEN)
            
            # Generate session token
            token = jwt.encode({
                'admin_id': admin.id,
                'exp': timezone.now() + timedelta(hours=24)
            }, settings.SECRET_KEY, algorithm='HS256')
            
            # Update admin session info
            admin.last_login = timezone.now()
            admin.session_token = token
            admin.session_expiry = timezone.now() + timedelta(hours=24)
            admin.save()
            
            return Response({
                "message": "Login successful",
                "token": token,
                "role": admin.role
            }, status=status.HTTP_200_OK)
            
        except Administrators.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class AdminLogoutView(APIView):
    def post(self, request):
        token = request.headers.get('Authorization')
        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_401_UNAUTHORIZED)
      
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            admin = Administrators.objects.get(session_token=token)
            admin.session_token = None
            admin.session_expiry = None
            admin.save()
            
            return Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
            
        except Administrators.DoesNotExist:
            return Response({"error": "Invalid session"}, status=status.HTTP_401_UNAUTHORIZED)

class CheckSessionView(APIView):
    def get(self, request):
        token = request.headers.get('Authorization')
        if not token:
            return Response({"error": "No token provided"}, status=status.HTTP_401_UNAUTHORIZED)
        
        try:
            if token.startswith('Bearer '):
                token = token[7:]
            
            admin = Administrators.objects.get(session_token=token)
            
            if admin.session_expiry and admin.session_expiry < timezone.now():
                admin.session_token = None
                admin.session_expiry = None
                admin.save()
                return Response({"error": "Session expired"}, status=status.HTTP_401_UNAUTHORIZED)
            
            return Response({
                "is_valid": True,
                "role": admin.role,
                "name": admin.name
            }, status=status.HTTP_200_OK)
            
        except Administrators.DoesNotExist:
            return Response({"error": "Invalid session"}, status=status.HTTP_401_UNAUTHORIZED)