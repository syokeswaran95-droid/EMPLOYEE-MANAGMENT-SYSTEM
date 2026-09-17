import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/payrollService';
import { employeeService } from '../services/employeeService';
import { Plus, DollarSign, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Payroll() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canManage = ['ADMIN', 'PAYROLL_OFFICER'].includes(user?.role);

  const [formData, setFormData] = useState({
    employee: '',
    month: 'September',
    year: 2026,
    basic_salary: '7000.00',
    allowances: '500.00',
    bonus: '200.00',
    overtime: '100.00',
    tax: '800.00',
    deductions: '150.00',
    status: 'Pending'
  });

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    try {
      const emps = await employeeService.getAll();
      setEmployees(emps);
      const data = await payrollService.getAll();
      setPayrolls(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      employee: employees[0]?.id || '',
      month: 'September',
      year: 2026,
      basic_salary: '7000.00',
      allowances: '500.00',
      bonus: '200.00',
      overtime: '100.00',
      tax: '800.00',
      deductions: '150.00',
      status: 'Pending'
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = async (payrollId, newStatus) => {
    try {
      await payrollService.update(payrollId, { status: newStatus });
      fetchInitial();
    } catch (err) {
      alert("Failed to update payroll status.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await payrollService.create(formData);
      fetchInitial();
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.error || "Error generating payroll record.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Payroll Management</h1>
          <p className="text-xs text-slate-500">Employee salary computation, allowances, tax deductions, and payslips</p>
        </div>
        {canManage && (
          <button onClick={handleOpenModal} className="btn-primary text-xs">
            <Plus size={16} /> Generate Payroll
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Period</th>
              <th>Employee</th>
              <th>Basic Salary</th>
              <th>Allowances & Bonus</th>
              <th>Tax & Deductions</th>
              <th>Net Salary</th>
              <th>Status</th>
              {canManage && <th className="text-right">Action</th>}
            </tr>
          </thead>
          <tbody>
            {payrolls.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-8 text-slate-400">
                  No payroll records generated yet.
                </td>
              </tr>
            ) : (
              payrolls.map((p) => (
                <tr key={p.id}>
                  <td className="font-bold text-slate-800">{p.month} {p.year}</td>
                  <td>
                    <div className="font-bold text-slate-900">{p.employee_name}</div>
                    <div className="text-[10px] text-slate-500">{p.emp_id} • {p.department_name}</div>
                  </td>
                  <td>${Number(p.basic_salary).toLocaleString()}</td>
                  <td className="text-emerald-700 font-medium">
                    +${(Number(p.allowances) + Number(p.bonus) + Number(p.overtime)).toLocaleString()}
                  </td>
                  <td className="text-red-600 font-medium">
                    -${(Number(p.tax) + Number(p.deductions)).toLocaleString()}
                  </td>
                  <td className="font-extrabold text-blue-900 text-sm">
                    ${Number(p.net_salary).toLocaleString()}
                  </td>
                  <td>
                    <span className={`badge ${
                      p.status === 'Paid' ? 'badge-active' :
                      p.status === 'Processed' ? 'badge-info' : 'badge-pending'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  {canManage && (
                    <td className="text-right">
                      {p.status === 'Pending' && (
                        <button
                          onClick={() => handleStatusChange(p.id, 'Paid')}
                          className="btn-primary text-[11px] py-1 px-2"
                        >
                          Mark Paid
                        </button>
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
            <h3 className="text-base font-bold text-slate-800 mb-4">Generate Employee Payroll</h3>
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
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Month</label>
                  <select
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                  >
                    {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Basic Salary ($)</label>
                  <input
                    type="number"
                    value={formData.basic_salary}
                    onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                    required
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Allowances ($)</label>
                  <input
                    type="number"
                    value={formData.allowances}
                    onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Bonus ($)</label>
                  <input
                    type="number"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Overtime ($)</label>
                  <input
                    type="number"
                    value={formData.overtime}
                    onChange={(e) => setFormData({ ...formData, overtime: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tax Deduction ($)</label>
                  <input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Other Deductions ($)</label>
                  <input
                    type="number"
                    value={formData.deductions}
                    onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Compute & Save Payroll
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
