from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Attendance.objects.all().order_by('-date')
        
        employee_id = self.request.query_params.get('employee', None)
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)

        date = self.request.query_params.get('date', None)
        if date:
            queryset = queryset.filter(date=date)

        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        department = self.request.query_params.get('department', None)
        if department:
            queryset = queryset.filter(employee__department_id=department)

        user = self.request.user
        if user.role == 'EMPLOYEE' and hasattr(user, 'employee_profile'):
            queryset = queryset.filter(employee=user.employee_profile)

        return queryset

    def create(self, request, *args, **kwargs):
        employee_id = request.data.get('employee')
        date = request.data.get('date')
        if Attendance.objects.filter(employee_id=employee_id, date=date).exists():
            return Response(
                {"error": "Attendance record already exists for this employee on the selected date."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return super().create(request, *args, **kwargs)
