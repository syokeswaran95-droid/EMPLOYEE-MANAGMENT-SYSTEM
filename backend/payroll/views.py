from rest_framework import viewsets, permissions
from .models import Payroll
from .serializers import PayrollSerializer
from notifications_app.models import Notification

class PayrollViewSet(viewsets.ModelViewSet):
    serializer_class = PayrollSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Payroll.objects.all().order_by('-year', '-id')
        
        employee_id = self.request.query_params.get('employee', None)
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)

        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)

        month = self.request.query_params.get('month', None)
        if month:
            queryset = queryset.filter(month=month)

        year = self.request.query_params.get('year', None)
        if year:
            queryset = queryset.filter(year=year)

        user = self.request.user
        if user.role == 'EMPLOYEE' and hasattr(user, 'employee_profile'):
            queryset = queryset.filter(employee=user.employee_profile)

        return queryset

    def perform_create(self, serializer):
        payroll = serializer.save()
        if payroll.employee.user:
            Notification.objects.create(
                recipient=payroll.employee.user,
                title="Payroll Generated",
                message=f"Payslip generated for {payroll.month} {payroll.year}. Net Salary: ${payroll.net_salary:,.2f}"
            )

    def perform_update(self, serializer):
        payroll = serializer.save()
        if payroll.status in ['Processed', 'Paid'] and payroll.employee.user:
            Notification.objects.create(
                recipient=payroll.employee.user,
                title=f"Payroll {payroll.status}",
                message=f"Your payroll for {payroll.month} {payroll.year} has been marked as {payroll.status}."
            )
