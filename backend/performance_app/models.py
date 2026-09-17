from django.db import models
from django.conf import settings
from employees.models import Employee

class PerformanceReview(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='performance_reviews')
    review_period = models.CharField(max_length=50)
    reviewer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='conducted_reviews'
    )
    productivity_rating = models.IntegerField(default=3)
    quality_rating = models.IntegerField(default=3)
    teamwork_rating = models.IntegerField(default=3)
    communication_rating = models.IntegerField(default=3)
    overall_rating = models.DecimalField(max_digits=3, decimal_places=1, default=3.0)
    strengths = models.TextField(blank=True, null=True)
    areas_for_improvement = models.TextField(blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    review_date = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ['-review_date']

    def save(self, *args, **kwargs):
        avg = (self.productivity_rating + self.quality_rating + self.teamwork_rating + self.communication_rating) / 4.0
        self.overall_rating = round(avg, 1)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.employee.full_name} - {self.review_period} ({self.overall_rating})"
