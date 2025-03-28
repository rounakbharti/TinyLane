from django.db import models
from django.contrib.auth.models import User

class URL(models.Model):
    original_url = models.URLField(max_length=2000)
    short_code = models.CharField(max_length=6, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)  # New field for expiration

    def __str__(self):
        return f"{self.short_code} -> {self.original_url}"

class Click(models.Model):
    url = models.ForeignKey(URL, on_delete=models.CASCADE, related_name='clicks')
    ip_address = models.GenericIPAddressField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Click on {self.url.short_code} from {self.ip_address}"