import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, CheckCircle, ArrowRight } from 'lucide-react';

export default function Logout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto text-2xl">
          <CheckCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">You Have Signed Out</h2>
        <p className="text-xs text-slate-500">
          Your session has been securely ended. Thank you for using the Employee Management System.
        </p>

        <div className="pt-4 border-t border-slate-100">
          <Link to="/login" className="btn-primary w-full justify-center text-xs py-2.5 font-semibold">
            Sign In Again <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
