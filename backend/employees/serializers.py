from rest_framework import serializers
from .models import Employee
from departments.serializers import DepartmentSerializer, JobPositionSerializer

class EmployeeSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    position_name = serializers.ReadOnlyField(source='position.title')
    manager_name = serializers.SerializerMethodField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Employee
        fields = '__all__'

    def get_manager_name(self, obj):
        if obj.manager:
            return obj.manager.full_name
        return None

class EmployeeDetailSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    position = JobPositionSerializer(read_only=True)
    manager_name = serializers.SerializerMethodField()
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = Employee
        fields = '__all__'

    def get_manager_name(self, obj):
        if obj.manager:
            return obj.manager.full_name
        return None
