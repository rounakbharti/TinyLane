from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShortenedURLViewSet, signup

router = DefaultRouter()
router.register(r'urls', ShortenedURLViewSet, basename='url')

urlpatterns = [
    path('', include(router.urls)),
    path('r/<str:pk>/', ShortenedURLViewSet.as_view({'get': 'redirect_url'}), name='redirect'),
    path('signup/', signup, name='signup'),
]