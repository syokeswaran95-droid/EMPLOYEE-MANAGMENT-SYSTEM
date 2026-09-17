import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { Bell, Check, CheckCheck } from 'lucide-react';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
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

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading notifications...</div>;

  return (
    <div className="space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">In-App Notifications</h1>
          <p className="text-xs text-slate-500">System alerts for leave updates, payroll generation, and performance reviews</p>
        </div>
        <button onClick={handleMarkAllRead} className="btn-secondary text-xs">
          <CheckCheck size={16} /> Mark All as Read
        </button>
      </div>

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="card text-center p-8 text-slate-400 text-xs">No notifications found.</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`card p-4 flex items-start justify-between transition ${
                n.is_read ? 'bg-white border-slate-200' : 'bg-blue-50/70 border-blue-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${n.is_read ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white'}`}>
                  <Bell size={16} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">{n.title}</h4>
                  <p className="text-slate-600 text-xs mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              {!n.is_read && (
                <button
                  onClick={() => handleMarkAsRead(n.id)}
                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded text-xs font-semibold flex items-center gap-1"
                >
                  <Check size={14} /> Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
