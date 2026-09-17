from django.db import models
from django.conf import settings
from employees.models import Employee

class LeaveRequest(models.Model):
    LEAVE_TYPES = (
        ('Casual Leave', 'Casual Leave'),
        ('Sick Leave', 'Sick Leave'),
        ('Earned Leave', 'Earned Leave'),
        ('Emergency Leave', 'Emergency Leave'),
        ('Maternity Leave', 'Maternity Leave'),
        ('Paternity Leave', 'Paternity Leave'),
        ('Unpaid Leave', 'Unpaid Leave'),
    )

    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Cancelled', 'Cancelled'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='leave_requests')
    leave_type = models.CharField(max_length=30, choices=LEAVE_TYPES, default='Casual Leave')
    start_date = models.DateField()
    end_date = models.DateField()
    number_of_days = models.IntegerField(default=1)
    reason = models.TextField()
    applied_date = models.DateTimeField(auto_now_add=True)
    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='approved_leaves'
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    remarks = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-applied_date']

    def __str__(self):
        return f"{self.employee.full_name} - {self.leave_type} ({self.status})"
