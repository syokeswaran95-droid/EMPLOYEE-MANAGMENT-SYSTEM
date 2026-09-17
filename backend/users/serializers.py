from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from employees.models import Employee
from datetime import date

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'employee_id': getattr(getattr(self.user, 'employee_profile', None), 'emp_id', None),
            'employee_profile_id': getattr(getattr(self.user, 'employee_profile', None), 'id', None)
        }
        return data

class UserSerializer(serializers.ModelSerializer):
    employee_id = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number', 'employee_id']

    def get_employee_id(self, obj):
        if hasattr(obj, 'employee_profile') and obj.employee_profile:
            return obj.employee_profile.emp_id
        return None

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'role', 'phone_number']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'EMPLOYEE'),
            phone_number=validated_data.get('phone_number', '')
        )

        emp_code = f"EMP{user.id + 2000}"
        Employee.objects.get_or_create(
            user=user,
            defaults={
                'emp_id': emp_code,
                'first_name': user.first_name or user.username,
                'last_name': user.last_name or 'User',
                'email': user.email,
                'phone': user.phone_number or '+1-555-0000',
                'joining_date': date.today(),
                'employment_type': 'Full Time',
                'salary': 60000.00,
                'status': 'Active'
            }
        )
        return user
