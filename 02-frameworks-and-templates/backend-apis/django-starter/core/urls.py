from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime

@api_view(['GET'])
def health_check(request):
    return Response({
        "status": "healthy",
        "framework": "Django 5.0 + DRF",
        "timestamp": datetime.utcnow().isoformat()
    })

urlpatterns = [
    path('api/health/', health_check),
]
