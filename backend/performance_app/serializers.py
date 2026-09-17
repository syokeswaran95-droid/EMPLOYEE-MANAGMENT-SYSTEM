from rest_framework import serializers
from .models import PerformanceReview

class PerformanceReviewSerializer(serializers.ModelSerializer):
    employee_name = serializers.ReadOnlyField(source='employee.full_name')
    emp_id = serializers.ReadOnlyField(source='employee.emp_id')
    department_name = serializers.ReadOnlyField(source='employee.department.name')
    reviewer_name = serializers.SerializerMethodField()

    class Meta:
        model = PerformanceReview
        fields = '__all__'
        read_only_fields = ['overall_rating']

    def get_reviewer_name(self, obj):
        if obj.reviewer:
            return f"{obj.reviewer.first_name} {obj.reviewer.last_name}".strip() or obj.reviewer.username
        return "N/A"
