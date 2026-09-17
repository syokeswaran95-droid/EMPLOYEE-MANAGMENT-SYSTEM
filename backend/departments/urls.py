from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, JobPositionViewSet

router = DefaultRouter()
router.register(r'departments', DepartmentViewSet, basename='department')
router.register(r'positions', JobPositionViewSet, basename='jobposition')

urlpatterns = [
    path('', include(router.urls)),
]
