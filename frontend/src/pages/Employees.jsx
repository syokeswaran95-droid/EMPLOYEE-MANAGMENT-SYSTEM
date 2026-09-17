import React, { useState, useEffect } from 'react';
import { employeeService } from '../services/employeeService';
import { departmentService } from '../services/departmentService';
import SearchBar from '../components/SearchBar';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { Plus, Filter, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const canManage = ['ADMIN', 'HR_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchQuery, selectedDept, selectedStatus, selectedType]);

  const fetchInitialData = async () => {
    try {
      const depts = await departmentService.getDepartments();
      const pos = await departmentService.getPositions();
      setDepartments(depts);
      setPositions(pos);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedDept) params.department = selectedDept;
      if (selectedStatus) params.status = selectedStatus;
      if (selectedType) params.employment_type = selectedType;

      const data = await employeeService.getAll(params);
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingEmployee(null);
    setIsFormOpen(true);
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setIsFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await employeeService.delete(deleteTargetId);
      fetchEmployees();
    } catch (err) {
      alert("Failed to delete employee.");
    } finally {
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Employee Directory</h1>
          <p className="text-xs text-slate-500">Manage organizational staff profiles and records</p>
        </div>
        {canManage && (
          <button onClick={handleCreateNew} className="btn-primary text-xs">
            <Plus size={16} /> Add Employee
          </button>
        )}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card p-4 flex flex-col md:flex-row items-center gap-3">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
          >
            <option value="">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
            <option value="Terminated">Terminated</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border border-slate-300 rounded-lg text-xs bg-white"
          >
            <option value="">All Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>
        </div>
      </div>

      {/* Employee Data Grid */}
      {loading ? (
        <div className="p-8 text-center text-slate-400">Loading employees list...</div>
      ) : (
        <EmployeeTable
          employees={employees}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteTargetId(id)}
          canManage={canManage}
        />
      )}

      {/* Form Modal */}
      <EmployeeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={fetchEmployees}
        initialData={editingEmployee}
      />

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This operation cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
