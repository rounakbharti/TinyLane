from celery import shared_task
from django.utils import timezone
from .models import ShortenedURL

@shared_task
def delete_expired_urls():
    expired = ShortenedURL.objects.filter(expires_at__lt=timezone.now())
    expired.delete()