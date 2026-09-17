import React, { useState, useEffect } from 'react';
import { payrollService } from '../services/payrollService';
import { Printer, Download, FileText, Building, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Payslips() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayslips();
  }, []);

  const fetchPayslips = async () => {
    try {
      const data = await payrollService.getAll();
      setPayrolls(data);
      if (data.length > 0) {
        setSelectedPayroll(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading payslip records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Payslips Portal</h1>
          <p className="text-xs text-slate-500">View and print official monthly salary statements</p>
        </div>
        {selectedPayroll && (
          <button onClick={handlePrint} className="btn-primary text-xs">
            <Printer size={16} /> Print Payslip
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Selector Sidebar */}
        <div className="card space-y-3">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Available Payslips</h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {payrolls.length === 0 ? (
              <p className="text-xs text-slate-400">No payslips found.</p>
            ) : (
              payrolls.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPayroll(p)}
                  className={`w-full text-left p-3 rounded-lg border transition ${
                    selectedPayroll?.id === p.id
                      ? 'bg-blue-50 border-blue-300 text-blue-900 font-semibold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold">{p.month} {p.year}</span>
                    <span className="text-emerald-700 font-extrabold">${Number(p.net_salary).toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1">{p.employee_name} ({p.emp_id})</div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Payslip Document Preview */}
        <div className="lg:col-span-2">
          {selectedPayroll ? (
            <div className="card p-8 border border-slate-300 bg-white shadow-md rounded-xl space-y-6 print:p-0 print:border-none print:shadow-none">
              {/* Header */}
              <div className="border-b-2 border-slate-800 pb-4 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">GLOBAL HR ENTERPRISES</h2>
                  <p className="text-xs text-slate-500">100 Enterprise Way, Technology Park, Suite 400</p>
                  <p className="text-xs text-slate-500">Official Monthly Payslip Statement</p>
                </div>
                <div className="text-right">
                  <span className="badge badge-active text-xs uppercase px-3 py-1 font-bold">
                    {selectedPayroll.status}
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-2">Pay Period: {selectedPayroll.month} {selectedPayroll.year}</p>
                </div>
              </div>

              {/* Employee Summary Details */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg text-xs border border-slate-200">
                <div>
                  <p className="text-slate-500">Employee Name:</p>
                  <p className="font-bold text-slate-900 text-sm">{selectedPayroll.employee_name}</p>
                  <p className="text-slate-500 mt-2">Employee ID:</p>
                  <p className="font-bold text-slate-900">{selectedPayroll.emp_id}</p>
                </div>
                <div>
                  <p className="text-slate-500">Department:</p>
                  <p className="font-bold text-slate-900">{selectedPayroll.department_name}</p>
                  <p className="text-slate-500 mt-2">Job Designation:</p>
                  <p className="font-bold text-slate-900">{selectedPayroll.position_name}</p>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                {/* Earnings */}
                <div>
                  <h4 className="font-bold text-slate-800 bg-emerald-50 text-emerald-800 p-2 rounded-t border border-emerald-200">
                    Gross Earnings
                  </h4>
                  <div className="border border-t-0 border-slate-200 rounded-b p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Basic Salary</span>
                      <span className="font-semibold">${Number(selectedPayroll.basic_salary).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Allowances</span>
                      <span className="font-semibold">${Number(selectedPayroll.allowances).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Performance Bonus</span>
                      <span className="font-semibold">${Number(selectedPayroll.bonus).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Overtime Pay</span>
                      <span className="font-semibold">${Number(selectedPayroll.overtime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-bold text-slate-800 bg-red-50 text-red-800 p-2 rounded-t border border-red-200">
                    Deductions
                  </h4>
                  <div className="border border-t-0 border-slate-200 rounded-b p-3 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Income Tax</span>
                      <span className="font-semibold text-red-600">-${Number(selectedPayroll.tax).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Other Deductions</span>
                      <span className="font-semibold text-red-600">-${Number(selectedPayroll.deductions).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Total Calculation Footer */}
              <div className="bg-slate-900 text-white p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="text-[11px] text-slate-400">Total Net Amount Paid</p>
                  <p className="text-xl font-black text-emerald-400">
                    ${Number(selectedPayroll.net_salary).toLocaleString()}
                  </p>
                </div>
                <div className="text-right text-[10px] text-slate-400">
                  <p>Computer Generated Payslip</p>
                  <p>No signature required</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center text-slate-400">Select a payslip to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
