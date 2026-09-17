import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeTable({ employees, onEdit, onDelete, canManage = true }) {
  const navigate = useNavigate();

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-active';
      case 'On Leave': return 'badge-pending';
      case 'Resigned': case 'Terminated': return 'badge-danger';
      default: return 'badge-inactive';
    }
  };

  return (
    <div className="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
      <table className="custom-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Name & Email</th>
            <th>Department</th>
            <th>Position</th>
            <th>Joining Date</th>
            <th>Type</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center py-8 text-slate-400">
                No employees found matching criteria.
              </td>
            </tr>
          ) : (
            employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50 transition">
                <td className="font-semibold text-slate-800">{emp.emp_id}</td>
                <td>
                  <div className="font-medium text-slate-900">{emp.full_name}</div>
                  <div className="text-xs text-slate-500">{emp.email}</div>
                </td>
                <td>{emp.department_name || 'N/A'}</td>
                <td>{emp.position_name || 'N/A'}</td>
                <td>{emp.joining_date}</td>
                <td>
                  <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {emp.employment_type}
                  </span>
                </td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(emp.status)}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/employees/${emp.id}`)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {canManage && (
                      <>
                        <button
                          onClick={() => onEdit(emp)}
                          className="p-1.5 text-slate-600 hover:bg-slate-100 rounded"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(emp.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
