from django.db import models
from django.contrib.auth.models import User
import time

class ShortenedURL(models.Model):
    original_url = models.URLField(max_length=2048)
    short_code = models.CharField(max_length=15, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)

    def click_count(self):
        return self.clicks.count()

class Click(models.Model):
    shortened_url = models.ForeignKey(ShortenedURL, related_name='clicks', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField()
    redirection_time = models.FloatField(default=0.0)  # In milliseconds
