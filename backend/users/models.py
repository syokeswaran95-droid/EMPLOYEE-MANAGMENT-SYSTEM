from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        HR_MANAGER = 'HR_MANAGER', 'HR Manager'
        DEPT_MANAGER = 'DEPT_MANAGER', 'Department Manager'
        PAYROLL_OFFICER = 'PAYROLL_OFFICER', 'Payroll Officer'
        EMPLOYEE = 'EMPLOYEE', 'Employee'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.EMPLOYEE,
        help_text="Role of the user in the system"
    )
    phone_number = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
