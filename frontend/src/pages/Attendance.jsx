import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { employeeService } from '../services/employeeService';
import { Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Form
  const [filterDate, setFilterDate] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee: '',
    date: new Date().toISOString().split('T')[0],
    check_in: '09:00',
    check_out: '17:00',
    working_hours: '8.00',
    status: 'Present',
    remarks: ''
  });

  const canManage = ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchAttendances();
  }, [filterDate, filterStatus]);

  const fetchInitialData = async () => {
    try {
      const emps = await employeeService.getAll();
      setEmployees(emps);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendances = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterDate) params.date = filterDate;
      if (filterStatus) params.status = filterStatus;
      const data = await attendanceService.getAll(params);
      setAttendances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      employee: employees[0]?.id || '',
      date: new Date().toISOString().split('T')[0],
      check_in: '09:00',
      check_out: '17:00',
      working_hours: '8.00',
      status: 'Present',
      remarks: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await attendanceService.create(formData);
      fetchAttendances();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || "Error marking attendance record.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Attendance Tracking</h1>
          <p className="text-xs text-slate-500">Daily check-in logs, working hours, and presence records</p>
        </div>
        {canManage && (
          <button onClick={handleOpenModal} className="btn-primary text-xs">
            <Plus size={16} /> Mark Attendance
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
        >
          <option value="">All Attendance Statuses</option>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
          <option value="Half Day">Half Day</option>
          <option value="Work From Home">Work From Home</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Working Hours</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendances.map((att) => (
                <tr key={att.id}>
                  <td className="font-semibold text-slate-800">{att.date}</td>
                  <td>
                    <div className="font-bold text-slate-900">{att.employee_name}</div>
                    <div className="text-[10px] text-slate-500">{att.emp_id} • {att.department_name}</div>
                  </td>
                  <td>{att.check_in || '--:--'}</td>
                  <td>{att.check_out || '--:--'}</td>
                  <td className="font-medium text-slate-700">{att.working_hours} hrs</td>
                  <td>
                    <span className={`badge ${
                      att.status === 'Present' ? 'badge-active' :
                      att.status === 'Late' ? 'badge-pending' :
                      att.status === 'Absent' ? 'badge-danger' : 'badge-info'
                    }`}>
                      {att.status}
                    </span>
                  </td>
                  <td className="text-slate-500 text-xs">{att.remarks || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mark Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <h3 className="text-base font-bold text-slate-800 mb-4">Mark Attendance</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Employee</label>
                <select
                  value={formData.employee}
                  onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                >
                  <option value="">Select Employee</option>
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>{e.emp_id} - {e.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                    <option value="Half Day">Half Day</option>
                    <option value="Work From Home">Work From Home</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Check In</label>
                  <input
                    type="time"
                    value={formData.check_in}
                    onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Check Out</label>
                  <input
                    type="time"
                    value={formData.check_out}
                    onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Remarks</label>
                <input
                  type="text"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Optional notes..."
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
