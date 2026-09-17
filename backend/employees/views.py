from rest_framework import viewsets, permissions, filters
from django.db.models import Q
from .models import Employee
from .serializers import EmployeeSerializer, EmployeeDetailSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Employee.objects.all().order_by('-joining_date')
        
        # Search query parameter
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(emp_id__icontains=search) |
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(phone__icontains=search) |
                Q(department__name__icontains=search) |
                Q(position__title__icontains=search)
            )

        # Filters
        department = self.request.query_params.get('department', None)
        if department:
            queryset = queryset.filter(department_id=department)

        position = self.request.query_params.get('position', None)
        if position:
            queryset = queryset.filter(position_id=position)

        status = self.request.query_params.get('status', None)
        if status:
            queryset = queryset.filter(status=status)

        employment_type = self.request.query_params.get('employment_type', None)
        if employment_type:
            queryset = queryset.filter(employment_type=employment_type)

        gender = self.request.query_params.get('gender', None)
        if gender:
            queryset = queryset.filter(gender=gender)

        # Role-based scoping: Department Manager only sees their department's employees
        user = self.request.user
        if user.role == 'DEPT_MANAGER' and hasattr(user, 'employee_profile') and user.employee_profile.department:
            queryset = queryset.filter(department=user.employee_profile.department)
        elif user.role == 'EMPLOYEE' and hasattr(user, 'employee_profile'):
            # Employee role can view list or detail of profile
            pass

        return queryset

    def get_serializer_class(self):
        if self.action in ['retrieve']:
            return EmployeeDetailSerializer
        return EmployeeSerializer
