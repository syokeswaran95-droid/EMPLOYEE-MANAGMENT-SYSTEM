import React, { useState, useEffect } from 'react';
import { departmentService } from '../services/departmentService';
import { Plus, Edit, Trash2, Briefcase } from 'lucide-react';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

export default function Positions() {
  const { user } = useAuth();
  const [positions, setPositions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPos, setEditingPos] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const [formData, setFormData] = useState({
    position_id: '',
    title: '',
    department: '',
    description: '',
    min_salary: '50000',
    max_salary: '90000',
    required_experience: '2-4 years',
    status: 'Active'
  });

  const canManage = ['ADMIN', 'HR_MANAGER'].includes(user?.role);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pos = await departmentService.getPositions();
      const depts = await departmentService.getDepartments();
      setPositions(pos);
      setDepartments(depts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pos = null) => {
    if (pos) {
      setEditingPos(pos);
      setFormData({
        position_id: pos.position_id,
        title: pos.title,
        department: pos.department,
        description: pos.description || '',
        min_salary: pos.min_salary || '50000',
        max_salary: pos.max_salary || '90000',
        required_experience: pos.required_experience || '2-4 years',
        status: pos.status || 'Active'
      });
    } else {
      setEditingPos(null);
      setFormData({
        position_id: `POS${Math.floor(100 + Math.random() * 900)}`,
        title: '',
        department: departments[0]?.id || '',
        description: '',
        min_salary: '50000',
        max_salary: '90000',
        required_experience: '2-4 years',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPos) {
        await departmentService.updatePosition(editingPos.id, formData);
      } else {
        await departmentService.createPosition(formData);
      }
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving position.");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await departmentService.deletePosition(deleteId);
      fetchData();
    } catch (err) {
      alert("Failed to delete position.");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Job Positions</h1>
          <p className="text-xs text-slate-500">Designated job titles, roles, and salary benchmarks</p>
        </div>
        {canManage && (
          <button onClick={() => handleOpenModal()} className="btn-primary text-xs">
            <Plus size={16} /> Add Position
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-x-auto shadow-sm">
        <table className="custom-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Job Title</th>
              <th>Department</th>
              <th>Salary Band</th>
              <th>Required Exp</th>
              <th>Status</th>
              {canManage && <th className="text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {positions.map((pos) => (
              <tr key={pos.id}>
                <td className="font-mono text-slate-600 font-semibold">{pos.position_id}</td>
                <td className="font-bold text-slate-800">{pos.title}</td>
                <td>{pos.department_name}</td>
                <td className="text-emerald-700 font-medium">
                  ${Number(pos.min_salary).toLocaleString()} - ${Number(pos.max_salary).toLocaleString()}
                </td>
                <td>{pos.required_experience}</td>
                <td>
                  <span className={`badge ${pos.status === 'Active' ? 'badge-active' : 'badge-inactive'}`}>
                    {pos.status}
                  </span>
                </td>
                {canManage && (
                  <td className="text-right">
                    <button onClick={() => handleOpenModal(pos)} className="p-1 hover:text-blue-600 mr-2">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => setDeleteId(pos.id)} className="p-1 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <h3 className="text-base font-bold text-slate-800 mb-4">
              {editingPos ? 'Edit Job Position' : 'Create Job Position'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Position Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs bg-white"
                >
                  <option value="">Select Department</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Min Salary ($)</label>
                  <input
                    type="number"
                    value={formData.min_salary}
                    onChange={(e) => setFormData({ ...formData, min_salary: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Max Salary ($)</label>
                  <input
                    type="number"
                    value={formData.max_salary}
                    onChange={(e) => setFormData({ ...formData, max_salary: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Position
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Position"
        message="Are you sure you want to delete this position?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
