from django.contrib import admin
from .models import ShortenedURL, Click

@admin.register(ShortenedURL)
class ShortenedURLAdmin(admin.ModelAdmin):
    list_display = ('short_code', 'original_url', 'user', 'created_at', 'expires_at', 'click_count')
    list_filter = ('user', 'created_at')
    search_fields = ('short_code', 'original_url')

@admin.register(Click)
class ClickAdmin(admin.ModelAdmin):
    list_display = ('shortened_url', 'timestamp', 'ip_address', 'redirection_time')
    list_filter = ('timestamp',)