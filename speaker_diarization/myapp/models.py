from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import make_password

class User(AbstractUser):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    username = models.CharField(
        max_length=128, 
        unique=True,
        null=False,
        blank=False,
    )

    password = models.CharField(max_length=128, null=True, blank=True)

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='myapp_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission', 
        related_name='myapp_user_set',
        blank=True
    )

    def __str__(self):
        return self.username or ''  # Handle potential None case