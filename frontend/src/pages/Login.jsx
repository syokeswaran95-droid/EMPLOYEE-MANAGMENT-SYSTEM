import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, ArrowRight, UserPlus } from 'lucide-react';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
  };

  const handleDemoLogin = async (demoUser, demoPass) => {
    setUsername(demoUser);
    setPassword(demoPass);
    setError('');
    try {
      await login(demoUser, demoPass);
      navigate('/dashboard');
    } catch (err) {
      setError('Demo login failed.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 p-8 text-white text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-xl shadow-lg">
            EMS
          </div>
          <h2 className="text-xl font-bold tracking-tight">Employee Management System</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to access your HR portal dashboard</p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Username / Email</label>
              <div className="relative">
                <UserCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center py-2.5 text-xs font-semibold mt-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-4 text-center text-xs">
            <span className="text-slate-500">Don't have an account? </span>
            <Link to="/register" className="text-blue-700 font-bold hover:underline">
              Create New Account
            </Link>
          </div>

          {/* Quick Demo Credentials Selector */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center mb-3">
              Quick Role Test Logins
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin', 'admin123')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left font-medium text-slate-700 transition"
              >
                <span className="block font-bold text-blue-800">Admin</span>
                <span className="text-[10px] text-slate-500">admin / admin123</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('hr_manager', 'hr123')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left font-medium text-slate-700 transition"
              >
                <span className="block font-bold text-blue-800">HR Manager</span>
                <span className="text-[10px] text-slate-500">hr_manager / hr123</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('dept_manager', 'manager123')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left font-medium text-slate-700 transition"
              >
                <span className="block font-bold text-blue-800">Dept Manager</span>
                <span className="text-[10px] text-slate-500">dept_manager / manager123</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('payroll_officer', 'payroll123')}
                className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-left font-medium text-slate-700 transition"
              >
                <span className="block font-bold text-blue-800">Payroll Officer</span>
                <span className="text-[10px] text-slate-500">payroll_officer / payroll123</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
