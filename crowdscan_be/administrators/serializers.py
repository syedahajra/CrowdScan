from rest_framework import serializers
from administrators.models import Administrators
from django.contrib.auth.hashers import make_password

class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrators
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True, 'min_length': 8}
        }
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        return super().update(instance, validated_data)