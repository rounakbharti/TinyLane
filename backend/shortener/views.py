from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.shortcuts import redirect
from django.http import Http404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import ShortenedURL, Click
from .serializers import ShortenedURLSerializer
from .utils import generate_short_code, generate_qr_code
from django.utils import timezone
import time

@api_view(['POST'])
def signup(request):
    """User signup endpoint."""
    # Allow anyone to signup by not setting permission_classes explicitly here
    username = request.data.get('username')
    password = request.data.get('password')
    if not username or not password:
        return Response({"error": "Username and password required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key}, status=status.HTTP_201_CREATED)

class ShortenedURLViewSet(viewsets.ModelViewSet):
    queryset = ShortenedURL.objects.all()
    serializer_class = ShortenedURLSerializer
    lookup_field = 'short_code'
    lookup_url_kwarg = 'pk'
    permission_classes = [IsAuthenticated]  # Default permission for the ViewSet

    def perform_create(self, serializer):
        """Create a shortened URL for the authenticated user."""
        custom_code = self.request.data.get('custom_code')
        if custom_code and ShortenedURL.objects.filter(short_code=custom_code).exists():
            raise serializers.ValidationError("Custom code already in use.")
        short_code = custom_code or generate_short_code()
        while not custom_code and ShortenedURL.objects.filter(short_code=short_code).exists():
            short_code = generate_short_code()
        full_short_url = f"http://localhost:8000/api/r/{short_code}/"
        qr_code_path = generate_qr_code(full_short_url, short_code)
        serializer.save(
            short_code=short_code,
            user=self.request.user,
            qr_code=qr_code_path
        )

    @action(detail=False, methods=['get'])
    def my_urls(self, request):
        """Return URLs created by the authenticated user."""
        urls = ShortenedURL.objects.filter(user=request.user)
        serializer = self.get_serializer(urls, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'], url_path='redirect', permission_classes=[AllowAny])  # Explicitly override permissions
    def redirect_url(self, request, pk=None):
        """Handle redirection and log clicks."""
        try:
            start_time = time.time()
            url = self.get_object()
            if url.expires_at and url.expires_at < timezone.now():
                raise Http404("URL has expired")
            redirection_time = (time.time() - start_time) * 1000  # Convert to ms
            Click.objects.create(
                shortened_url=url,
                ip_address=request.META.get('REMOTE_ADDR', '0.0.0.0'),
                redirection_time=redirection_time
            )
            return redirect(url.original_url)
        except ShortenedURL.DoesNotExist:
            raise Http404("URL not found")