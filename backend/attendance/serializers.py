from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.full_name')
    emp_id = serializers.ReadOnlyField(source='employee.emp_id')
    department_name = serializers.ReadOnlyField(source='employee.department.name')

    class Meta:
        model = Attendance
        fields = '__all__'
