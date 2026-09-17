from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import date

from employees.models import Employee
from departments.models import Department
from attendance.models import Attendance
from leaves.models import LeaveRequest
from payroll.models import Payroll
from performance_app.models import PerformanceReview

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()

        total_employees = Employee.objects.count()
        active_employees = Employee.objects.filter(status='Active').count()
        employees_on_leave = Employee.objects.filter(status='On Leave').count()
        total_departments = Department.objects.filter(status='Active').count()
        pending_leaves = LeaveRequest.objects.filter(status='Pending').count()

        # Today's attendance breakdown
        today_attendances = Attendance.objects.filter(date=today)
        present_count = today_attendances.filter(status='Present').count()
        absent_count = today_attendances.filter(status='Absent').count()
        late_count = today_attendances.filter(status='Late').count()

        payroll_pending = Payroll.objects.filter(status='Pending').count()

        # Chart: Employees by Department
        dept_dist = Department.objects.annotate(
            count=Count('employees')
        ).values('name', 'count')
        employees_by_department = [{'department': item['name'], 'count': item['count']} for item in dept_dist]

        # Chart: Employee Status Distribution
        status_dist = Employee.objects.values('status').annotate(count=Count('id'))
        employee_status_distribution = [{'status': item['status'], 'count': item['count']} for item in status_dist]

        # Chart: Attendance Summary
        attendance_dist = Attendance.objects.values('status').annotate(count=Count('id'))
        attendance_summary = [{'status': item['status'], 'count': item['count']} for item in attendance_dist]

        # Chart: Leave Type Summary
        leave_dist = LeaveRequest.objects.values('leave_type').annotate(count=Count('id'))
        leave_summary = [{'leave_type': item['leave_type'], 'count': item['count']} for item in leave_dist]

        return Response({
            'total_employees': total_employees,
            'active_employees': active_employees,
            'employees_on_leave': employees_on_leave,
            'total_departments': total_departments,
            'pending_leaves': pending_leaves,
            'today_attendance': {
                'present': present_count,
                'absent': absent_count,
                'late': late_count,
                'total_marked': today_attendances.count()
            },
            'payroll_pending': payroll_pending,
            'employees_by_department': employees_by_department,
            'employee_status_distribution': employee_status_distribution,
            'attendance_summary': attendance_summary,
            'leave_summary': leave_summary
        })

class ReportsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Comprehensive reports payload
        department_reports = Department.objects.annotate(
            total_employees=Count('employees'),
            avg_salary=Avg('employees__salary')
        ).values('id', 'name', 'code', 'total_employees', 'avg_salary')

        leave_stats = LeaveRequest.objects.values('leave_type', 'status').annotate(
            count=Count('id'),
            total_days=Sum('number_of_days')
        )

        payroll_summary = Payroll.objects.values('year', 'month').annotate(
            total_basic=Sum('basic_salary'),
            total_allowances=Sum('allowances'),
            total_bonus=Sum('bonus'),
            total_tax=Sum('tax'),
            total_deductions=Sum('deductions'),
            total_net=Sum('net_salary'),
            count=Count('id')
        ).order_by('-year', '-month')

        performance_summary = PerformanceReview.objects.values('review_period').annotate(
            avg_overall=Avg('overall_rating'),
            avg_productivity=Avg('productivity_rating'),
            avg_quality=Avg('quality_rating'),
            count=Count('id')
        )

        return Response({
            'department_reports': list(department_reports),
            'leave_stats': list(leave_stats),
            'payroll_summary': list(payroll_summary),
            'performance_summary': list(performance_summary),
        })
