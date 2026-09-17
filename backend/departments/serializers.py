from rest_framework import serializers
from .models import Department, JobPosition

class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField()
    manager_name = serializers.SerializerMethodField()

    class Meta:
        model = Department
        fields = '__all__'

    def get_employee_count(self, obj):
        return obj.employees.count()

    def get_manager_name(self, obj):
        if obj.manager:
            return f"{obj.manager.first_name} {obj.manager.last_name}".strip() or obj.manager.username
        return "Unassigned"

class JobPositionSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')

    class Meta:
        model = JobPosition
        fields = '__all__'
