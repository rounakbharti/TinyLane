from rest_framework import serializers
from .models import ShortenedURL, Click

class ClickSerializer(serializers.ModelSerializer):
    class Meta:
        model = Click
        fields = ['timestamp', 'ip_address', 'redirection_time']

class ShortenedURLSerializer(serializers.ModelSerializer):
    clicks = ClickSerializer(many=True, read_only=True)
    click_count = serializers.IntegerField(source='click_count', read_only=True)

    class Meta:
        model = ShortenedURL
        fields = ['id', 'original_url', 'short_code', 'created_at', 'expires_at', 'qr_code', 'click_count', 'clicks']