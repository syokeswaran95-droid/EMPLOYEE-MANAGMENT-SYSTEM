import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { departmentService } from '../services/departmentService';
import { employeeService } from '../services/employeeService';

export default function EmployeeForm({ isOpen, onClose, onSave, initialData = null }) {
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    emp_id: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: 'Male',
    date_of_birth: '',
    address: '',
    department: '',
    position: '',
    joining_date: new Date().toISOString().split('T')[0],
    employment_type: 'Full Time',
    salary: '60000',
    manager: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    status: 'Active'
  });

  useEffect(() => {
    if (isOpen) {
      loadDropdownData();
      if (initialData) {
        setFormData({
          emp_id: initialData.emp_id || '',
          first_name: initialData.first_name || '',
          last_name: initialData.last_name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          gender: initialData.gender || 'Male',
          date_of_birth: initialData.date_of_birth || '',
          address: initialData.address || '',
          department: initialData.department || '',
          position: initialData.position || '',
          joining_date: initialData.joining_date || new Date().toISOString().split('T')[0],
          employment_type: initialData.employment_type || 'Full Time',
          salary: initialData.salary || '60000',
          manager: initialData.manager || '',
          emergency_contact_name: initialData.emergency_contact_name || '',
          emergency_contact_phone: initialData.emergency_contact_phone || '',
          status: initialData.status || 'Active'
        });
      } else {
        setFormData({
          emp_id: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
          first_name: '',
          last_name: '',
          email: '',
          phone: '',
          gender: 'Male',
          date_of_birth: '',
          address: '',
          department: '',
          position: '',
          joining_date: new Date().toISOString().split('T')[0],
          employment_type: 'Full Time',
          salary: '60000',
          manager: '',
          emergency_contact_name: '',
          emergency_contact_phone: '',
          status: 'Active'
        });
      }
    }
  }, [isOpen, initialData]);

  const loadDropdownData = async () => {
    try {
      const depts = await departmentService.getDepartments();
      const pos = await departmentService.getPositions();
      const emps = await employeeService.getAll();
      setDepartments(depts);
      setPositions(pos);
      setManagers(emps);
    } catch (err) {
      console.error("Failed to load select options", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.emp_id || !formData.first_name || !formData.last_name || !formData.email) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      // Clean up empty optional fields
      const payload = { ...formData };
      if (!payload.department) delete payload.department;
      if (!payload.position) delete payload.position;
      if (!payload.manager) delete payload.manager;

      if (initialData) {
        await employeeService.update(initialData.id, payload);
      } else {
        await employeeService.create(payload);
      }
      onSave();
      onClose();
    } catch (err) {
      const errResponse = err.response?.data;
      if (errResponse) {
        const errorMsg = typeof errResponse === 'object' 
          ? Object.entries(errResponse).map(([k, v]) => `${k}: ${v}`).join(' | ') 
          : 'Save failed.';
        setError(errorMsg);
      } else {
        setError('Save failed. Please check network connection.');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card max-w-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <h3 className="text-base font-bold text-slate-800">
            {initialData ? 'Edit Employee Details' : 'Add New Employee'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Employee ID *</label>
              <input
                type="text"
                name="emp_id"
                value={formData.emp_id}
                onChange={handleChange}
                required
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="">Select Department</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Job Position</label>
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="">Select Position</option>
                {positions.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Employment Type</label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Intern">Intern</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Joining Date</label>
              <input
                type="date"
                name="joining_date"
                value={formData.joining_date}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Annual Salary ($)</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Resigned">Resigned</option>
                <option value="Terminated">Terminated</option>
                <option value="Retired">Retired</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
              <input
                type="text"
                name="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                name="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={handleChange}
                className="w-full p-2 border border-slate-300 rounded text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button type="button" onClick={onClose} className="btn-secondary text-xs">
              Cancel
            </button>
            <button type="submit" className="btn-primary text-xs">
              <Save size={14} /> Save Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
