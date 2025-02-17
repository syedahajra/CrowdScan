from django.db import models
from django.contrib.postgres.fields import ArrayField

class Person(models.Model):
    name = models.CharField(max_length=100)
    address = models.TextField(blank=True, null=True)
    image = models.TextField()
    cnic_number = models.CharField(max_length=13, unique=True)
    feature_vector = ArrayField(models.FloatField(), blank=True, null=True)
    #feature_vector = models.JSONField() 
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
