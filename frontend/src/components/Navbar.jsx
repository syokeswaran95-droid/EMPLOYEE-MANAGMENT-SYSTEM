import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, User, LogOut, ShieldCheck, Check } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">Employee Management System</h2>
        <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full border border-blue-200">
          SOP v1.0
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button 
            onClick={() => { setShowNotifications(!showNotifications); setShowUserMenu(false); }}
            className="p-2 text-slate-600 hover:text-blue-700 hover:bg-slate-100 rounded-full relative transition"
            title="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
                <span className="text-xs text-blue-600 font-medium">{unreadCount} unread</span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 p-4 text-center">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-3 text-xs border-b border-slate-50 flex justify-between items-start ${n.is_read ? 'bg-white text-slate-500' : 'bg-blue-50/50 font-medium text-slate-800'}`}
                    >
                      <div>
                        <p className="font-semibold">{n.title}</p>
                        <p className="mt-0.5 text-slate-600">{n.message}</p>
                      </div>
                      {!n.is_read && (
                        <button 
                          onClick={() => handleMarkAsRead(n.id)}
                          className="text-blue-600 hover:text-blue-800 ml-2"
                          title="Mark read"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              <div className="p-2 text-center border-t border-slate-100">
                <button 
                  onClick={() => { navigate('/notifications'); setShowNotifications(false); }}
                  className="text-xs text-blue-600 font-semibold hover:underline"
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button 
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-sm">
              {user?.username ? user.username[0].toUpperCase() : 'U'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-semibold text-slate-800 leading-tight">
                {user?.first_name ? `${user.first_name} ${user.last_name}` : user?.username}
              </p>
              <p className="text-[10px] text-blue-600 font-medium leading-tight">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">{user?.email}</p>
                <p className="text-[10px] text-slate-500 capitalize">Role: {user?.role}</p>
              </div>
              <button 
                onClick={() => {
                  if (user?.employee_profile_id) {
                    navigate(`/employees/${user.employee_profile_id}`);
                  } else {
                    navigate('/dashboard');
                  }
                  setShowUserMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <User size={14} /> My Profile
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <button 
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
