from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('departments.urls')),
    path('api/', include('employees.urls')),
    path('api/', include('attendance.urls')),
    path('api/', include('leaves.urls')),
    path('api/', include('payroll.urls')),
    path('api/', include('performance_app.urls')),
    path('api/', include('notifications_app.urls')),
    path('api/', include('reports_app.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
