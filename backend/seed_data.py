import os
import django
from datetime import date, timedelta, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from departments.models import Department, JobPosition
from employees.models import Employee
from attendance.models import Attendance
from leaves.models import LeaveRequest
from payroll.models import Payroll
from performance_app.models import PerformanceReview
from notifications_app.models import Notification

User = get_user_model()

def seed():
    print("Clearing old demo data...")
    Notification.objects.all().delete()
    PerformanceReview.objects.all().delete()
    Payroll.objects.all().delete()
    LeaveRequest.objects.all().delete()
    Attendance.objects.all().delete()
    Employee.objects.all().delete()
    JobPosition.objects.all().delete()
    Department.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()

    print("Creating Demo Users...")
    admin_user = User.objects.create_user(
        username='admin',
        email='admin@company.com',
        password='admin123',
        role='ADMIN',
        first_name='Admin',
        last_name='User'
    )

    hr_user = User.objects.create_user(
        username='hr_manager',
        email='hr@company.com',
        password='hr123',
        role='HR_MANAGER',
        first_name='Priya',
        last_name='Devi'
    )

    mgr_user = User.objects.create_user(
        username='dept_manager',
        email='manager@company.com',
        password='manager123',
        role='DEPT_MANAGER',
        first_name='Vikram',
        last_name='Singh'
    )

    payroll_user = User.objects.create_user(
        username='payroll_officer',
        email='payroll@company.com',
        password='payroll123',
        role='PAYROLL_OFFICER',
        first_name='Karthik',
        last_name='Raj'
    )

    emp1_user = User.objects.create_user(
        username='arun_kumar',
        email='arun.kumar@company.com',
        password='emp123',
        role='EMPLOYEE',
        first_name='Arun',
        last_name='Kumar'
    )

    emp2_user = User.objects.create_user(
        username='ananya_sharma',
        email='ananya.sharma@company.com',
        password='emp123',
        role='EMPLOYEE',
        first_name='Ananya',
        last_name='Sharma'
    )

    emp3_user = User.objects.create_user(
        username='rahul_verma',
        email='rahul.verma@company.com',
        password='emp123',
        role='EMPLOYEE',
        first_name='Rahul',
        last_name='Verma'
    )

    print("Creating Departments...")
    hr_dept = Department.objects.create(
        dept_id='DEP101', name='Human Resources', code='HR', description='Manages recruitment, employee relations, and policy.', manager=hr_user
    )
    it_dept = Department.objects.create(
        dept_id='DEP102', name='Information Technology', code='IT', description='Manages software engineering, hardware, and infrastructure.', manager=mgr_user
    )
    fin_dept = Department.objects.create(
        dept_id='DEP103', name='Finance', code='FIN', description='Handles financial accounting, budgeting, and payroll.', manager=payroll_user
    )
    mkt_dept = Department.objects.create(
        dept_id='DEP104', name='Marketing', code='MKT', description='Handles brand strategies, communications, and client outreach.'
    )

    print("Creating Job Positions...")
    pos_dev = JobPosition.objects.create(
        position_id='POS101', title='Software Developer', department=it_dept, min_salary=60000, max_salary=110000, required_experience='2-5 years'
    )
    pos_hr = JobPosition.objects.create(
        position_id='POS102', title='HR Executive', department=hr_dept, min_salary=45000, max_salary=75000, required_experience='1-3 years'
    )
    pos_acc = JobPosition.objects.create(
        position_id='POS103', title='Accountant', department=fin_dept, min_salary=50000, max_salary=85000, required_experience='2-4 years'
    )
    pos_mkt = JobPosition.objects.create(
        position_id='POS104', title='Marketing Specialist', department=mkt_dept, min_salary=48000, max_salary=80000, required_experience='1-4 years'
    )

    print("Creating Employees...")
    emp1 = Employee.objects.create(
        user=emp1_user, emp_id='EMP1001', first_name='Arun', last_name='Kumar', email='arun.kumar@company.com',
        phone='+1-555-0101', gender='Male', date_of_birth=date(1995, 6, 15), address='123 Tech Park, San Jose, CA',
        department=it_dept, position=pos_dev, joining_date=date(2023, 1, 10), employment_type='Full Time', salary=85000,
        emergency_contact_name='Ramesh Kumar', emergency_contact_phone='+1-555-9901', status='Active'
    )

    emp2 = Employee.objects.create(
        user=hr_user, emp_id='EMP1002', first_name='Priya', last_name='Devi', email='hr@company.com',
        phone='+1-555-0102', gender='Female', date_of_birth=date(1992, 4, 20), address='456 HR Blvd, Chicago, IL',
        department=hr_dept, position=pos_hr, joining_date=date(2022, 5, 1), employment_type='Full Time', salary=68000,
        emergency_contact_name='Suresh Devi', emergency_contact_phone='+1-555-9902', status='Active'
    )

    emp3 = Employee.objects.create(
        user=payroll_user, emp_id='EMP1003', first_name='Karthik', last_name='Raj', email='payroll@company.com',
        phone='+1-555-0103', gender='Male', date_of_birth=date(1990, 11, 8), address='789 Wall St, New York, NY',
        department=fin_dept, position=pos_acc, joining_date=date(2021, 3, 15), employment_type='Full Time', salary=75000,
        emergency_contact_name='Lata Raj', emergency_contact_phone='+1-555-9903', status='Active'
    )

    emp4 = Employee.objects.create(
        user=emp2_user, emp_id='EMP1004', first_name='Ananya', last_name='Sharma', email='ananya.sharma@company.com',
        phone='+1-555-0104', gender='Female', date_of_birth=date(1998, 9, 12), address='321 Creative Way, Austin, TX',
        department=mkt_dept, position=pos_mkt, joining_date=date(2024, 2, 1), employment_type='Contract', salary=58000,
        emergency_contact_name='Mohan Sharma', emergency_contact_phone='+1-555-9904', status='Active'
    )

    emp5 = Employee.objects.create(
        user=emp3_user, emp_id='EMP1005', first_name='Rahul', last_name='Verma', email='rahul.verma@company.com',
        phone='+1-555-0105', gender='Male', date_of_birth=date(1997, 1, 25), address='654 Silicon Ave, Seattle, WA',
        department=it_dept, position=pos_dev, joining_date=date(2023, 8, 20), employment_type='Full Time', salary=82000,
        manager=emp1, emergency_contact_name='Sunita Verma', emergency_contact_phone='+1-555-9905', status='Active'
    )

    print("Creating Attendance Records...")
    today = date.today()
    for i in range(7):
        att_date = today - timedelta(days=i)
        if att_date.weekday() < 5:  # Weekdays
            Attendance.objects.create(
                employee=emp1, date=att_date, check_in=time(9, 0), check_out=time(17, 30), working_hours=8.5, status='Present'
            )
            Attendance.objects.create(
                employee=emp2, date=att_date, check_in=time(9, 15), check_out=time(17, 15), working_hours=8.0, status='Present'
            )
            Attendance.objects.create(
                employee=emp3, date=att_date, check_in=time(9, 45), check_out=time(17, 45), working_hours=8.0, status='Late'
            )
            Attendance.objects.create(
                employee=emp4, date=att_date, check_in=time(9, 0), check_out=time(17, 0), working_hours=8.0, status='Work From Home'
            )
            Attendance.objects.create(
                employee=emp5, date=att_date, check_in=time(9, 10), check_out=time(17, 20), working_hours=8.1, status='Present'
            )

    print("Creating Leave Requests...")
    LeaveRequest.objects.create(
        employee=emp1, leave_type='Casual Leave', start_date=today + timedelta(days=5), end_date=today + timedelta(days=7),
        number_of_days=3, reason='Family event in hometown.', status='Pending'
    )
    LeaveRequest.objects.create(
        employee=emp4, leave_type='Sick Leave', start_date=today - timedelta(days=10), end_date=today - timedelta(days=9),
        number_of_days=2, reason='Viral fever', status='Approved', approved_by=hr_user
    )

    print("Creating Payroll Records...")
    Payroll.objects.create(
        employee=emp1, month='September', year=2026, basic_salary=7083.33, allowances=500.00, bonus=300.00,
        overtime=200.00, tax=1000.00, deductions=200.00, status='Paid', payment_date=today - timedelta(days=15)
    )
    Payroll.objects.create(
        employee=emp2, month='September', year=2026, basic_salary=5666.67, allowances=400.00, bonus=200.00,
        overtime=0.00, tax=700.00, deductions=150.00, status='Paid', payment_date=today - timedelta(days=15)
    )
    Payroll.objects.create(
        employee=emp3, month='September', year=2026, basic_salary=6250.00, allowances=450.00, bonus=250.00,
        overtime=100.00, tax=800.00, deductions=180.00, status='Pending'
    )

    print("Creating Performance Reviews...")
    PerformanceReview.objects.create(
        employee=emp1, review_period='Q2 2026', reviewer=mgr_user, productivity_rating=5, quality_rating=4,
        teamwork_rating=5, communication_rating=4, strengths='Exceptional code quality and architecture skills.',
        areas_for_improvement='Can delegate more technical tasks.', comments='Outstanding contribution to project delivery.'
    )
    PerformanceReview.objects.create(
        employee=emp5, review_period='Q2 2026', reviewer=admin_user, productivity_rating=4, quality_rating=4,
        teamwork_rating=4, communication_rating=4, strengths='Strong problem solver and fast learner.',
        areas_for_improvement='Documentation clarity.', comments='Solid progress in the last quarter.'
    )

    print("Creating System Notifications...")
    Notification.objects.create(
        recipient=admin_user, title='Welcome to EMS System', message='System initialized with 5 employees across 4 departments.', is_read=False
    )
    Notification.objects.create(
        recipient=emp1_user, title='Leave Request Submitted', message='Your leave request for Casual Leave is currently pending approval.', is_read=False
    )
    Notification.objects.create(
        recipient=hr_user, title='Pending Leave Applications', message='1 new leave application requires your review.', is_read=False
    )

    print("Seeding finished successfully!")

if __name__ == '__main__':
    seed()
