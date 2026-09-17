from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import LeaveRequest
from .serializers import LeaveRequestSerializer
from notifications_app.models import Notification

class LeaveRequestViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = LeaveRequest.objects.all().order_by('-applied_date')
        
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        employee_id = self.request.query_params.get('employee', None)
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)

        user = self.request.user
        if user.role == 'EMPLOYEE' and hasattr(user, 'employee_profile'):
            queryset = queryset.filter(employee=user.employee_profile)
        elif user.role == 'DEPT_MANAGER' and hasattr(user, 'employee_profile') and user.employee_profile.department:
            queryset = queryset.filter(employee__department=user.employee_profile.department)

        return queryset

    def perform_create(self, serializer):
        leave_instance = serializer.save()
        # Create notification for employee's manager or HR
        if leave_instance.employee.manager and leave_instance.employee.manager.user:
            Notification.objects.create(
                recipient=leave_instance.employee.manager.user,
                title="New Leave Application",
                message=f"{leave_instance.employee.full_name} applied for {leave_instance.leave_type} ({leave_instance.start_date} to {leave_instance.end_date})."
            )

    def perform_update(self, serializer):
        instance = serializer.save(approved_by=self.request.user)
        # Notify employee of decision
        if instance.employee.user:
            Notification.objects.create(
                recipient=instance.employee.user,
                title=f"Leave Application {instance.status}",
                message=f"Your {instance.leave_type} request from {instance.start_date} to {instance.end_date} has been {instance.status.lower()}."
            )
