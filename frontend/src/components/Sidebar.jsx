import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, Building2, Briefcase, CalendarCheck,
  FileText, DollarSign, Award, BarChart3, Bell, UserCheck
} from 'lucide-react';

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'EMPLOYEE';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'PAYROLL_OFFICER', 'EMPLOYEE'] },
    { label: 'Employees', path: '/employees', icon: Users, roles: ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'PAYROLL_OFFICER'] },
    { label: 'Departments', path: '/departments', icon: Building2, roles: ['ADMIN', 'HR_MANAGER'] },
    { label: 'Job Positions', path: '/positions', icon: Briefcase, roles: ['ADMIN', 'HR_MANAGER'] },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck, roles: ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'EMPLOYEE'] },
    { label: 'Leave Requests', path: '/leaves', icon: FileText, roles: ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'EMPLOYEE'] },
    { label: 'Payroll', path: '/payroll', icon: DollarSign, roles: ['ADMIN', 'PAYROLL_OFFICER'] },
    { label: 'Payslips', path: '/payslips', icon: DollarSign, roles: ['EMPLOYEE', 'PAYROLL_OFFICER', 'ADMIN'] },
    { label: 'Performance', path: '/performance', icon: Award, roles: ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'EMPLOYEE'] },
    { label: 'Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'PAYROLL_OFFICER'] },
    { label: 'Notifications', path: '/notifications', icon: Bell, roles: ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER', 'PAYROLL_OFFICER', 'EMPLOYEE'] },
  ];

  const allowedNav = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-screen">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          EMS
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">ENTERPRISE</h1>
          <p className="text-[10px] text-slate-400">HR Operations Portal</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {allowedNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-center">
        <p className="text-[10px] text-slate-500">Employee Management System &copy; 2026</p>
      </div>
    </aside>
  );
}
