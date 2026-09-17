import React, { useState, useEffect } from 'react';
import { performanceService } from '../services/performanceService';
import { employeeService } from '../services/employeeService';
import { Award, Plus, Star, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Performance() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const canReview = ['ADMIN', 'HR_MANAGER', 'DEPT_MANAGER'].includes(user?.role);

  const [formData, setFormData] = useState({
    employee: '',
    review_period: 'Q3 2026',
    productivity_rating: 4,
    quality_rating: 4,
    teamwork_rating: 5,
    communication_rating: 4,
    strengths: '',
    areas_for_improvement: '',
    comments: ''
  });

  useEffect(() => {
    fetchInitial();
  }, []);

  const fetchInitial = async () => {
    try {
      const emps = await employeeService.getAll();
      setEmployees(emps);
      const data = await performanceService.getAll();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setFormData({
      employee: employees[0]?.id || '',
      review_period: 'Q3 2026',
      productivity_rating: 4,
      quality_rating: 4,
      teamwork_rating: 5,
      communication_rating: 4,
      strengths: '',
      areas_for_improvement: '',
      comments: ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await performanceService.create(formData);
      fetchInitial();
      setIsModalOpen(false);
    } catch (err) {
      alert("Error saving performance evaluation.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Performance Management</h1>
          <p className="text-xs text-slate-500">Employee ratings, feedback reviews, and evaluations</p>
        </div>
        {canReview && (
          <button onClick={handleOpenModal} className="btn-primary text-xs">
            <Plus size={16} /> Add Review
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((rev) => (
          <div key={rev.id} className="card space-y-3">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{rev.employee_name}</h3>
                <p className="text-[10px] text-slate-500">{rev.emp_id} • {rev.department_name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200">
                  {rev.review_period}
                </span>
                <p className="text-sm font-black text-amber-500 flex items-center justify-end gap-1 mt-1">
                  <Star size={14} fill="currentColor" /> {rev.overall_rating} / 5.0
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-[10px] bg-slate-50 p-2 rounded">
              <div>
                <span className="text-slate-500">Productivity</span>
                <p className="font-bold text-slate-800">{rev.productivity_rating}/5</p>
              </div>
              <div>
                <span className="text-slate-500">Quality</span>
                <p className="font-bold text-slate-800">{rev.quality_rating}/5</p>
              </div>
              <div>
                <span className="text-slate-500">Teamwork</span>
                <p className="font-bold text-slate-800">{rev.teamwork_rating}/5</p>
              </div>
              <div>
                <span className="text-slate-500">Communication</span>
                <p className="font-bold text-slate-800">{rev.communication_rating}/5</p>
              </div>
            </div>

            <div className="text-xs space-y-1">
              <p><span className="font-semibold text-slate-700">Strengths:</span> {rev.strengths || 'N/A'}</p>
              <p><span className="font-semibold text-slate-700">Areas for Improvement:</span> {rev.areas_for_improvement || 'N/A'}</p>
            </div>

            <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 flex justify-between">
              <span>Reviewed By: {rev.reviewer_name}</span>
              <span>Date: {rev.review_date}</span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <h3 className="text-base font-bold text-slate-800 mb-4">Add Performance Review</h3>
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
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Review Period</label>
                <input
                  type="text"
                  value={formData.review_period}
                  onChange={(e) => setFormData({ ...formData, review_period: e.target.value })}
                  required
                  className="w-full p-2 border border-slate-300 rounded text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Productivity (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.productivity_rating}
                    onChange={(e) => setFormData({ ...formData, productivity_rating: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Quality (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.quality_rating}
                    onChange={(e) => setFormData({ ...formData, quality_rating: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Teamwork (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.teamwork_rating}
                    onChange={(e) => setFormData({ ...formData, teamwork_rating: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Communication (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={formData.communication_rating}
                    onChange={(e) => setFormData({ ...formData, communication_rating: parseInt(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Strengths</label>
                <textarea
                  value={formData.strengths}
                  onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs h-16"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Areas for Improvement</label>
                <textarea
                  value={formData.areas_for_improvement}
                  onChange={(e) => setFormData({ ...formData, areas_for_improvement: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded text-xs h-16"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary text-xs">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-xs">
                  Save Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
