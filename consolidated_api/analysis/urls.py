# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('analyze/<str:ip>/', views.analyze_ip, name='analyze_ip'),
]