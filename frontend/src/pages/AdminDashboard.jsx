import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Users, Building2, CalendarCheck, Clock, FileText, DollarSign } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#1e40af', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await reportService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard data...</div>;
  if (!stats) return <div className="p-8 text-center text-red-500">Unable to load dashboard data.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Executive Dashboard</h1>
          <p className="text-xs text-slate-500">Real-time organizational analytics and HR metrics</p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Employees</p>
            <h3 className="text-xl font-extrabold text-slate-800">{stats.total_employees}</h3>
            <p className="text-[10px] text-emerald-600 font-medium">{stats.active_employees} Active Staff</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Building2 size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Departments</p>
            <h3 className="text-xl font-extrabold text-slate-800">{stats.total_departments}</h3>
            <p className="text-[10px] text-slate-400">Operational Units</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CalendarCheck size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Today's Attendance</p>
            <h3 className="text-xl font-extrabold text-slate-800">{stats.today_attendance.present} Present</h3>
            <p className="text-[10px] text-amber-600 font-medium">{stats.today_attendance.late} Late | {stats.today_attendance.absent} Absent</p>
          </div>
        </div>

        <div className="card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <FileText size={22} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Leaves</p>
            <h3 className="text-xl font-extrabold text-slate-800">{stats.pending_leaves}</h3>
            <p className="text-[10px] text-amber-600 font-medium">Awaiting Manager Review</p>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Chart */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Department Workforce Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.employees_by_department}>
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#1e40af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Status Pie Chart */}
        <div className="card">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Employee Status Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.employee_status_distribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.employee_status_distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
