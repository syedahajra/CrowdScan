from django.contrib import admin
from .models import Person  # Make sure you import your model

# Register the User model
admin.site.register(Person)
