from django.http import JsonResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
import json
import random
import string
from .models import URL, Click
from django.utils import timezone
from datetime import timedelta

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)
        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return JsonResponse({'token': token.key}, status=201)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key}, status=200)
        return JsonResponse({'error': 'Invalid credentials'}, status=401)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def url_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            original_url = data.get('original_url')
            expires_in = data.get('expires_in')
            if not original_url:
                return JsonResponse({'error': 'Original URL is required'}, status=400)
            short_code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
            while URL.objects.filter(short_code=short_code).exists():
                short_code = ''.join(random.choices(string.ascii_letters + string.digits, k=6))
            expires_at = None
            if expires_in:
                expires_at = timezone.now() + timedelta(minutes=int(expires_in))
            url = URL.objects.create(
                original_url=original_url,
                short_code=short_code,
                user=request.user,
                expires_at=expires_at
            )
            short_url = f"http://localhost:8000/api/r/{short_code}"
            return JsonResponse({
                'short_url': short_url,
                'original_url': url.original_url,
                'short_code': url.short_code,
                'expires_at': url.expires_at.isoformat() if url.expires_at else None,
                'created_at': url.created_at.isoformat()
            }, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    elif request.method == 'GET':
        try:
            urls = URL.objects.filter(user=request.user).order_by('-created_at')  # Latest first
            url_data = [{
                'short_url': f"http://localhost:8000/api/r/{url.short_code}",
                'original_url': url.original_url,
                'short_code': url.short_code,
                'expires_at': url.expires_at.isoformat() if url.expires_at else None,
                'created_at': url.created_at.isoformat()
            } for url in urls]
            return JsonResponse(url_data, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([AllowAny])
def redirect_url(request, short_code):
    try:
        url = URL.objects.get(short_code=short_code)
        if url.expires_at and url.expires_at < timezone.now():
            return JsonResponse({'error': 'This URL has expired'}, status=410)
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        Click.objects.create(url=url, ip_address=ip_address)
        return HttpResponseRedirect(url.original_url)
    except URL.DoesNotExist:
        return JsonResponse({'error': 'Short URL not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_url_analytics(request, short_code):
    try:
        url = URL.objects.get(short_code=short_code, user=request.user)
        clicks = [{
            'ip_address': click.ip_address,
            'timestamp': click.timestamp.isoformat()
        } for click in url.clicks.all()]
        return JsonResponse({
            'short_url': f"http://localhost:8000/api/r/{url.short_code}",
            'original_url': url.original_url,
            'created_at': url.created_at.isoformat(),
            'expires_at': url.expires_at.isoformat() if url.expires_at else None,
            'clicks': clicks
        })
    except URL.DoesNotExist:
        return JsonResponse({'error': 'Short URL not found or not yours'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)