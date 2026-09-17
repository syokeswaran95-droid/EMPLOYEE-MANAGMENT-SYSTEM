from django.db import models
from employees.models import Employee

class Payroll(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending'),
        ('Processed', 'Processed'),
        ('Paid', 'Paid'),
        ('Cancelled', 'Cancelled'),
    )

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='payrolls')
    month = models.CharField(max_length=20)
    year = models.IntegerField()
    basic_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    allowances = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    overtime = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['employee', 'month', 'year'], name='unique_payroll_per_month_year')
        ]
        ordering = ['-year', '-id']

    def save(self, *args, **kwargs):
        # Backend Net Salary calculation formula
        self.net_salary = (
            self.basic_salary + self.allowances + self.bonus + self.overtime
        ) - (self.tax + self.deductions)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.full_name} - {self.month} {self.year} ({self.status})"
