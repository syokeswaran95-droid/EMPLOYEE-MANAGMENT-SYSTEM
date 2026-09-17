from django.urls import path
from .views import DashboardStatsView, ReportsView

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard_stats'),
    path('reports/', ReportsView.as_view(), name='reports_summary'),
]
