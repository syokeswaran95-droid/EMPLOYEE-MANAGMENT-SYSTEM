from rest_framework import viewsets, permissions
from .models import Department, JobPosition
from .serializers import DepartmentSerializer, JobPositionSerializer

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all().order_by('name')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class JobPositionViewSet(viewsets.ModelViewSet):
    queryset = JobPosition.objects.all().order_by('title')
    serializer_class = JobPositionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['department', 'status']
