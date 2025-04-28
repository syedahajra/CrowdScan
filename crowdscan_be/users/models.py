from django.db import models
from django.contrib.postgres.fields import ArrayField

class User(models.Model):
    name = models.CharField(max_length=100, default="Unknown")
    address = models.TextField(blank=True, null=True, default="NA")
    image = models.TextField()
    cnic_number = models.CharField(max_length=13, blank=True, null=True, default="NA")
    feature_vector = ArrayField(models.FloatField(), blank=True, null=True) 
    updated_at = models.DateTimeField(auto_now_add=True, blank=True)
    type = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name
