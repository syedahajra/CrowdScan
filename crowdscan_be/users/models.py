from django.db import models
from django.contrib.postgres.fields import ArrayField

class User(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True, null=True)
    image = models.TextField()
    cnic_number = models.CharField(max_length=13, unique=True)
    feature_vector = ArrayField(models.FloatField(), blank=True, null=True) 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
