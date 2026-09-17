import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { Plus, Edit, Trash2, Building2, Users } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

export default function Departments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    dept_id: '',
    name: '',
    code: '',
    description: '',
    status: 'Active'
  });

  const canManage = ['ADMIN', 'HR_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (dept = null) => {
    if (dept) {
      setEditingDept(dept);
      setFormData({
        dept_id: dept.dept_id,
        name: dept.name,
        code: dept.code,
        description: dept.description || '',
        status: dept.status || 'Active'
      });
    } else {
      setEditingDept(null);
      setFormData({
        dept_id: `DEP${Math.floor(100 + Math.random() * 900)}`,
        name: '',
        code: '',
        description: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentService.updateDepartment(editingDept.id, formData);
      } else {
        await departmentService.createDepartment(formData);
      }
      fetchDepartments();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving department details.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await departmentService.deleteDepartment(deleteId);
      fetchDepartments();
    } catch (err) {
      alert("Failed to delete department.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Departments</h1>
          <p className="text-xs text-slate-500">Organizational units and department structures</p>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary text-xs">
            <Plus size={16} /> Add Department
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => (
          <div key={dept.id} className="card relative group hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {dept.code}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{dept.name}</h3>
                  <span className="text-[10px] text-slate-400 font-mono">ID: {dept.dept_id}</span>
                </div>
              </div>
              <span className={`badge ${dept.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                {dept.status}
              </span>
            </div>

            <p className="text-xs text-slate-600 my-3 line-clamp-2 min-h-[2.25rem]">
              {dept.description || 'No description provided.'}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span className="flex items-center gap-1.5 font-medium">
                <Users size={14} className="text-blue-600" /> {dept.employee_count} Employees
              </span>
              {canManage && (
                <div className="flex items-center gap-1">
                  <button onClick={() => handleOpenModal(dept)} className="p-1 hover:text-blue-600">
                    <Edit size={14} />
                  </button>
                  <button onClick={() => setDeleteId(dept.id)} className="p-1 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Department Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <h3 className="text-base font-bold text-slate-800 mb-4">
              {editingDept ? 'Edit Department' : 'Create Department'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department ID</label>
                <input
                  type="text"
                  value={formData.dept_id}
                  onChange={(e) => setFormData({ ...formData, dept_id: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs h-20"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Department"
        message="Are you sure you want to remove this department?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
