from django.db import models
from django.conf import settings
from departments.models import Department, JobPosition

class Employee(models.Model):
    GENDER_CHOICES = (
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
    )

    EMPLOYMENT_TYPES = (
        ('Full Time', 'Full Time'),
        ('Part Time', 'Part Time'),
        ('Contract', 'Contract'),
        ('Intern', 'Intern'),
    )

    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('On Leave', 'On Leave'),
        ('Resigned', 'Resigned'),
        ('Terminated', 'Terminated'),
        ('Retired', 'Retired'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='employee_profile'
    )
    emp_id = models.CharField(max_length=20, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='Male')
    date_of_birth = models.DateField(null=True, blank=True)
    address = models.TextField(blank=True, null=True)

    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    position = models.ForeignKey(JobPosition, on_delete=models.SET_NULL, null=True, blank=True, related_name='employees')
    joining_date = models.DateField()
    employment_type = models.CharField(max_length=20, choices=EMPLOYMENT_TYPES, default='Full Time')
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    manager = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='subordinates')
    emergency_contact_name = models.CharField(max_length=100, blank=True, null=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True, null=True)
    profile_photo = models.ImageField(upload_to='employees/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"

    def __str__(self):
        return f"{self.emp_id} - {self.full_name}"
