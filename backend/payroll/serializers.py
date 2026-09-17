from rest_framework import serializers
from .models import Payroll

class PayrollSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.full_name')
    emp_id = serializers.ReadOnlyField(source='employee.emp_id')
    department_name = serializers.ReadOnlyField(source='employee.department.name')
    position_name = serializers.ReadOnlyField(source='employee.position.title')

    class Meta:
        model = Payroll
        fields = '__all__'
        read_only_fields = ['net_salary']
