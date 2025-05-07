from django.db import models
from django.contrib.postgres.fields import ArrayField

class User(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, default="Unknown")
    address = models.TextField(blank=True, null=True, default="NA")
    image = models.TextField()
    cnic_number = models.CharField(max_length=13, blank=True, null=True, default="NA")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Features(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_features')
    feature_vector = ArrayField(models.FloatField(), blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    model_name = models.CharField(max_length=100)

    def __str__(self):
        return f"Features for {self.user.name}"


class Administrators(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, required=True, null=False, default="admin")
    password = models.CharField(min_length=8, max_length=128, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    role = models.CharField(choices=[('admin', 'Admin'), ('officer', 'Officer')], max_length=10, default='officer')
    
    def __str__(self):
        return self.name


class ScanHistory(models.Model):
    id = models.AutoField(primary_key=True)
    query_image = models.TextField()
    matched_user = ArrayField(models.CharField(max_length=100), blank=True, null=True)
    scan_time = models.DateTimeField(auto_now_add=True)
    scan_type = models.CharField(max_length=100)
    threshold = models.FloatField()
    scanned_by = models.ForeignKey(Administrators, on_delete=models.CASCADE, related_name='scan_history', null=True)
    
    def __str__(self):
        return f"Scan History for {self.query_image}"