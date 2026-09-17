from rest_framework import viewsets, permissions
from .models import PerformanceReview
from .serializers import PerformanceReviewSerializer
from notifications_app.models import Notification

class PerformanceReviewViewSet(viewsets.ModelViewSet):
    serializer_class = PerformanceReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = PerformanceReview.objects.all().order_by('-review_date')
        
        employee_id = self.request.query_params.get('employee', None)
        if employee_id:
            queryset = queryset.filter(employee_id=employee_id)

        user = self.request.user
        if user.role == 'EMPLOYEE' and hasattr(user, 'employee_profile'):
            queryset = queryset.filter(employee=user.employee_profile)
        elif user.role == 'DEPT_MANAGER' and hasattr(user, 'employee_profile') and user.employee_profile.department:
            queryset = queryset.filter(employee__department=user.employee_profile.department)

        return queryset

    def perform_create(self, serializer):
        review = serializer.save(reviewer=self.request.user)
        if review.employee.user:
            Notification.objects.create(
                recipient=review.employee.user,
                title="New Performance Review Added",
                message=f"A performance review for '{review.review_period}' has been added with rating {review.overall_rating}/5.0."
            )
