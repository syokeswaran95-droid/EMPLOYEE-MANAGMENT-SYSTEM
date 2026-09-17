import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { Download, BarChart3, FileSpreadsheet } from 'lucide-react';

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportService.getReports();
      setReports(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = (data, filename) => {
    if (!data || data.length === 0) return;
    const keys = Object.keys(data[0]);
    const csvContent = [
      keys.join(','),
      ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading reports...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Operational & Analytics Reports</h1>
          <p className="text-xs text-slate-500">Database-driven HR metric reports and CSV exports</p>
        </div>
      </div>

      {/* Department Report Card */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-600" /> Department Salary & Headcount Summary
          </h3>
          <button
            onClick={() => exportCSV(reports?.department_reports, 'department_summary_report')}
            className="btn-secondary text-xs"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Total Staff</th>
                <th>Average Salary ($)</th>
              </tr>
            </thead>
            <tbody>
              {reports?.department_reports?.map((dept) => (
                <tr key={dept.id}>
                  <td className="font-bold text-slate-800">{dept.code}</td>
                  <td>{dept.name}</td>
                  <td className="font-semibold text-blue-700">{dept.total_employees}</td>
                  <td className="font-semibold text-emerald-700">
                    ${dept.avg_salary ? Number(dept.avg_salary).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payroll Monthly Report Card */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <FileSpreadsheet size={16} className="text-blue-600" /> Monthly Payroll Expenditure Report
          </h3>
          <button
            onClick={() => exportCSV(reports?.payroll_summary, 'payroll_expenditure_report')}
            className="btn-secondary text-xs"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Processed Count</th>
                <th>Gross Basic ($)</th>
                <th>Total Allowances ($)</th>
                <th>Total Tax ($)</th>
                <th>Net Total Salary ($)</th>
              </tr>
            </thead>
            <tbody>
              {reports?.payroll_summary?.map((pay, idx) => (
                <tr key={idx}>
                  <td className="font-bold text-slate-800">{pay.month} {pay.year}</td>
                  <td>{pay.count}</td>
                  <td>${Number(pay.total_basic || 0).toLocaleString()}</td>
                  <td className="text-emerald-700">+${Number(pay.total_allowances || 0).toLocaleString()}</td>
                  <td className="text-red-600">-${Number(pay.total_tax || 0).toLocaleString()}</td>
                  <td className="font-black text-blue-900">${Number(pay.total_net || 0).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
