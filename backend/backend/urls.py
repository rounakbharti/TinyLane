from django.urls import path
from . import views

urlpatterns = [
    path('api/auth/signup/', views.signup, name='signup'),
    path('api/auth/login/', views.login, name='login'),
    path('api/urls/', views.url_view, name='url_view'),  # Combined GET and POST
    path('api/urls/<str:short_code>/analytics/', views.get_url_analytics, name='get_url_analytics'),
    path('api/r/<str:short_code>/', views.redirect_url, name='redirect_url'),
]