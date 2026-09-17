import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../services/employeeService';
import { attendanceService } from '../services/attendanceService';
import { leaveService } from '../services/leaveService';
import { payrollService } from '../services/payrollService';
import { performanceService } from '../services/performanceService';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Building2, Shield, ArrowLeft } from 'lucide-react';

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [attendances, setAttendances] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployeeData();
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      const emp = await employeeService.getById(id);
      setEmployee(emp);

      // Load related modules for this employee
      const attData = await attendanceService.getAll({ employee: id });
      const leaveData = await leaveService.getAll({ employee: id });
      const payData = await payrollService.getAll({ employee: id });
      const perfData = await performanceService.getAll({ employee: id });

      setAttendances(attData);
      setLeaves(leaveData);
      setPayrolls(payData);
      setReviews(perfData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading profile details...</div>;
  if (!employee) return <div className="p-8 text-center text-red-500">Employee profile not found.</div>;

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="btn-secondary text-xs">
        <ArrowLeft size={14} /> Back to Directory
      </button>

      {/* Header Profile Card */}
      <div className="card flex flex-col md:flex-row items-center md:items-start gap-6 bg-slate-900 text-white p-6">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center font-bold text-3xl text-white shadow-lg border-4 border-slate-800">
          {employee.first_name[0]}{employee.last_name[0]}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-2xl font-extrabold">{employee.full_name}</h2>
            <span className="badge badge-active text-xs px-3 py-1">
              {employee.status}
            </span>
          </div>
          <p className="text-sm text-blue-400 font-medium mt-1">
            {employee.position?.title || 'Position N/A'} • {employee.department?.name || 'Department N/A'}
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5"><Shield size={14} /> ID: {employee.emp_id}</span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> {employee.email}</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> {employee.phone}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> Joined: {employee.joining_date}</span>
          </div>
        </div>
      </div>

      {/* Detail Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal & Employment Specs */}
        <div className="card space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <User size={16} className="text-blue-600" /> Personal & Employment Details
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-slate-500 font-medium">Gender:</span> <p className="font-semibold text-slate-800">{employee.gender}</p></div>
            <div><span className="text-slate-500 font-medium">Date of Birth:</span> <p className="font-semibold text-slate-800">{employee.date_of_birth || 'N/A'}</p></div>
            <div><span className="text-slate-500 font-medium">Employment Type:</span> <p className="font-semibold text-slate-800">{employee.employment_type}</p></div>
            <div><span className="text-slate-500 font-medium">Annual Base Salary:</span> <p className="font-semibold text-emerald-700">${Number(employee.salary).toLocaleString()}</p></div>
            <div><span className="text-slate-500 font-medium">Manager:</span> <p className="font-semibold text-slate-800">{employee.manager_name || 'None'}</p></div>
            <div><span className="text-slate-500 font-medium">Address:</span> <p className="font-semibold text-slate-800">{employee.address || 'N/A'}</p></div>
          </div>

          <h4 className="text-xs font-bold text-slate-700 border-b border-slate-100 pb-1 mt-4">Emergency Contact</h4>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><span className="text-slate-500">Contact Name:</span> <p className="font-medium">{employee.emergency_contact_name || 'N/A'}</p></div>
            <div><span className="text-slate-500">Contact Phone:</span> <p className="font-medium">{employee.emergency_contact_phone || 'N/A'}</p></div>
          </div>
        </div>

        {/* Module Summary Logs */}
        <div className="card space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Briefcase size={16} className="text-blue-600" /> Organizational Activity Logs
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 flex justify-between">
                <span>Recent Attendance Log ({attendances.length})</span>
                <span className="text-blue-600 font-normal">Last 7 Records</span>
              </div>
              <p className="text-slate-500 mt-1">
                {attendances.length > 0 ? `Latest: ${attendances[0].date} (${attendances[0].status})` : 'No attendance logged.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 flex justify-between">
                <span>Leave Requests ({leaves.length})</span>
                <span className="text-amber-600 font-normal">History</span>
              </div>
              <p className="text-slate-500 mt-1">
                {leaves.length > 0 ? `Latest: ${leaves[0].leave_type} - Status: ${leaves[0].status}` : 'No leave history.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 flex justify-between">
                <span>Payroll History ({payrolls.length})</span>
                <span className="text-emerald-600 font-normal">Issued Payslips</span>
              </div>
              <p className="text-slate-500 mt-1">
                {payrolls.length > 0 ? `Latest: ${payrolls[0].month} ${payrolls[0].year} - Net: $${Number(payrolls[0].net_salary).toLocaleString()}` : 'No payroll records.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-800 flex justify-between">
                <span>Performance Rating</span>
                <span className="text-indigo-600 font-bold">
                  {reviews.length > 0 ? `${reviews[0].overall_rating} / 5.0` : 'Unrated'}
                </span>
              </div>
              <p className="text-slate-500 mt-1">
                {reviews.length > 0 ? `Latest Review: ${reviews[0].review_period}` : 'No reviews on record.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
