import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import { employeeService } from '../services/employeeService';
import { Plus, Check, X, FileText, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LeaveManagement() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canApprove = ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER'].includes(user?.role);

  const [formData, setFormData] = useState({
    employee: '',
    leave_type: 'Casual Leave',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    number_of_days: 1,
    reason: ''
  });

  useEffect(() => {
    fetchInitial();
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [filterStatus]);

  const fetchInitial = async () => {
    try {
      const emps = await employeeService.getAll();
      setEmployees(emps);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      const data = await leaveService.getAll(params);
      setLeaves(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    const defaultEmp = user?.employee_profile_id || employees[0]?.id || '';
    setFormData({
      employee: defaultEmp,
      leave_type: 'Casual Leave',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date().toISOString().split('T')[0],
      number_of_days: 1,
      reason: ''
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      await leaveService.update(leaveId, { status: newStatus });
      fetchLeaves();
    } catch (err) {
      alert("Failed to update leave request status.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.create(formData);
      fetchLeaves();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error submitting leave application.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Leave Management</h1>
          <p className="text-xs text-slate-500">Employee leave applications, approvals, and balance history</p>
        </div>
        <button onClick={handleOpenModal} className="btn-primary text-xs">
          <Plus size={16} /> Apply for Leave
        </button>
      </div>

      <div className="card p-4 flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-700">Filter Status:</span>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
        >
          <option value="">All Leave Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave Type</th>
              <th>Duration</th>
              <th>Days</th>
              <th>Reason</th>
              <th>Status</th>
              {canApprove && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-8 text-slate-400">
                  No leave requests logged.
                </td>
              </tr>
            ) : (
              leaves.map((l) => (
                <tr key={l.id}>
                  <td>
                    <div className="font-bold text-slate-900">{l.employee_name}</div>
                    <div className="text-[10px] text-slate-500">{l.emp_id} • {l.department_name}</div>
                  </td>
                  <td className="font-semibold text-slate-700">{l.leave_type}</td>
                  <td>{l.start_date} to {l.end_date}</td>
                  <td className="font-medium text-slate-800">{l.number_of_days} day(s)</td>
                  <td className="text-xs text-slate-600 max-w-xs truncate">{l.reason}</td>
                  <td>
                    <span className={`badge ${
                      l.status === 'Approved' ? 'badge-active' :
                      l.status === 'Pending' ? 'badge-pending' : 'badge-danger'
                    }`}>
                      {l.status}
                    </span>
                  </td>
                  {canApprove && (
                    <td className="text-right">
                      {l.status === 'Pending' && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleStatusChange(l.id, 'Approved')}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(l.id, 'Rejected')}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <h3 className="text-base font-bold text-slate-800 mb-4">Apply for Leave</h3>
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

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Leave Type</label>
                <select
                  value={formData.leave_type}
                  onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="Emergency Leave">Emergency Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                  <option value="Paternity Leave">Paternity Leave</option>
                  <option value="Unpaid Leave">Unpaid Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Number of Days</label>
                <input
                  type="number"
                  min="1"
                  value={formData.number_of_days}
                  onChange={(e) => setFormData({ ...formData, number_of_days: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs h-20"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
