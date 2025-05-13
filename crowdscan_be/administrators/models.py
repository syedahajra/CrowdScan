from django.db import models
from django.contrib.auth.hashers import make_password
# Create your models here.
class Administrators(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, null=False, unique=True)
    email = models.EmailField(max_length=254, null=False, unique=True)
    password = models.CharField(max_length=128, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(choices=[('admin', 'Admin'), ('officer', 'Officer')], max_length=10, default='officer')
    last_login = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    session_token = models.CharField(max_length=255, null=True, blank=True)
    session_expiry = models.DateTimeField(null=True, blank=True)
    
    def __str__(self) -> str:
        return str(self.name)
    
    def set_password(self, password):
        self.password = make_password(password)